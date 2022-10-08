import './style.css'

function toggleDarkMode () {
  const classList = document.body.parentElement.classList

  if (classList.contains('dark'))
    classList.remove('dark')
  else
    classList.add('dark')
}

window.toggleDarkMode = toggleDarkMode