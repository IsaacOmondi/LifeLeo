function toggleBrightnessMode() {
  const html = document.getElementById('htmlPage')
  const brightnessMode = document.getElementById('toggleBrightnessMode');
  const setMode = brightnessMode.getAttribute('set-mode')
  if (setMode == 'light') {
    html.setAttribute('data-bs-theme', 'dark')
  } else if (setMode == 'dark') {
    html.setAttribute('data-bs-theme', 'light')
  }
}



const brightnessMode = document.getElementById('toggleBrightnessMode');
brightnessMode.addEventListener('click', toggleBrightnessMode)