// theme.js
document.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", themeToggle);

  let coloresAlternados = false;

  function themeToggle() {
    const darkTheme = {
      "--color-0": "black",
      "--color-1": "#ffffff",
      "--primary-color": "#171717",
      "--secondary-color": "#555",
      "--bg-color": "#212121",
    };

    const lightTheme = {
      "--color-0": "#ddd",
      "--color-1": "#333",
      "--primary-color": "#3C2373 ",
      "--secondary-color": "#5AFF81 ",
      "--bg-color": "#F9F9F9",
    };

    if (coloresAlternados) {
      aplicarColores(darkTheme);
      themeBtn.innerHTML =
        '<i class="iconify" data-icon="mdi:white-balance-sunny"></i>';
    } else {
      aplicarColores(lightTheme);
      themeBtn.innerHTML =
        '<i class="iconify" data-icon="mdi:moon-waning-crescent"></i>';
    }

    coloresAlternados = !coloresAlternados;
  }

  function aplicarColores(colores) {
    for (const [propiedad, valor] of Object.entries(colores)) {
      document.documentElement.style.setProperty(propiedad, valor);
    }
  }
});
