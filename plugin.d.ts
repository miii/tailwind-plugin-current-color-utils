import plugin from 'tailwindcss/plugin'

interface PluginOptions {
  /**
   * Use custom contrast colors [black, white]
   * @default ['#000', '#FFF']
   */
  contrastColors: [string, string]
}

export default plugin.withOptions<PluginOptions>