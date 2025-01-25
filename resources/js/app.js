function toggleLightMode() {
  const html = document.getElementById('htmlPage')
  html.setAttribute('data-bs-theme', 'light')
}

function toggleDarkMode() {
  const html = document.getElementById('htmlPage')
  html.setAttribute('data-bs-theme', 'dark')
}


const btnToggleLight = document.getElementById('btnToggleLight');
const btnToggleDark = document.getElementById('btnToggleDark');
btnToggleLight.addEventListener('click', toggleLightMode)
btnToggleDark.addEventListener('click', toggleDarkMode)