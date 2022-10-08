const plugin = require('tailwindcss/plugin')
const resolveConfig = require('tailwindcss/resolveConfig')

/**
 * Recursively get all colors from Tailwind config
 * @param {Record<string, any>} obj Colors object
 * @param {string[]} prefix Color path
 * @returns List of colors
 */
const getColorsFromObj = (obj, prefix = []) => {
  return Object.entries(obj).reduce((colors, [key, value]) => {
    const color = [...prefix, key]

    if (typeof value === 'object')
      colors.push(...getColorsFromObj(value, color))
    else
      colors.push({ name: color.join('-'), value })

    return colors
  }, [])
}

/**
 * Convert HEX color to RGB
 * @param {string} hex HEX color
 * @returns {RGBArray} RGB channels
 */
const hexToRgb = (hex) => {
  if (hex.indexOf('#') === 0)
    hex = hex.slice(1)
  else
    return null

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]

  if (hex.length !== 6)
    throw new Error('Invalid HEX color.')

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  
  return [r, g, b]
}

/**
 * @typedef {[number, number, number]} RGBArray RGB color
 */

/**
 * Get inverted + contrast color from a RGB color
 * @param {RGBArray} rgb RGB color
 * @param {[RGBArray, RGBArray]} contrastColors Contrast colors
 * @returns Calculated colors
 */
const getColorProps = ([r, g, b], contrastColors) => {
  const contrastArr = Array.from(contrastColors)

  // https://stackoverflow.com/a/3943023/112731
  if ((r * 0.299 + g * 0.587 + b * 0.114) <= 186)
    contrastArr.reverse()

  // invert color components
  const ri = (255 - r)
  const gi = (255 - g)
  const bi = (255 - b)

  return {
    color: [r, g, b],
    inverted: [ri, gi, bi],
    contrast: contrastArr[0],
    contrastInverted: contrastArr[1],
  }
}

/**
 * @typedef {Object} PluginOptions Plugin options
 * @property {[string, string]} contrastColors Contrast colors [black, white]
 */

/**
 * @type {PluginOptions}
 */
const defaultOptions = {
  contrastColors: ['#000', '#FFF'], 
}

const currentColorUtilsPlugin = plugin.withOptions(
  (/** @type {Partial<PluginOptions>} */ options) => (api) => {
    // Setup options
    const opt = Object.assign({}, defaultOptions, options)
    const contrastColors = opt.contrastColors.map(hex => hexToRgb(hex))

    const path = module.parent.path
    const resolvedColors = resolveConfig(path).theme.colors

    const colors = getColorsFromObj(resolvedColors)
    const utilities = colors.reduce((obj, color) => {
      const rgb = hexToRgb(color.value)

      if (rgb) {
        const colorProps = getColorProps(rgb, contrastColors)

        // Apply to all .text-<color> classes
        obj[`.text-${color.name}`] = {
          '--cc-current-color': colorProps.color.join(' '),
          '--cc-current-color-inverted': colorProps.inverted.join(' '),
          '--cc-current-color-contrast': colorProps.contrast.join(' '),
          '--cc-current-color-contrast-inverted': colorProps.contrastInverted.join(' '),
        }
      }

      return obj
    }, {})

    api.addUtilities({ 'text-current': { color: 'currentColor' } })
    api.addUtilities(utilities)
  },

  (/** @type {Partial<PluginOptions>} */ options) => {
    // Setup options
    const opt = Object.assign({}, defaultOptions, options)
    const contrastColors = opt.contrastColors.map(hex => hexToRgb(hex).join(' '))

    return {
      theme: {
        extend: {
          colors: {
            'current!': 'currentColor',
            current: `rgb(var(--cc-current-color, ${contrastColors[0]}) / <alpha-value>)`,
            'current-contrast': `rgb(var(--cc-current-color-contrast, ${contrastColors[1]}) / <alpha-value>)`,
            'current-inverted': `rgb(var(--cc-current-color-inverted, ${contrastColors[1]}) / <alpha-value>)`,
            'current-contrast-inverted': `rgb(var(--cc-current-color-contrast-inverted, ${contrastColors[0]}) / <alpha-value>)`,
          }
        }
      }
    }
  }
)

module.exports = currentColorUtilsPlugin