//preventivos.js

// Mes por defecto en el select
const mesActual = new Date().getMonth();
const selectMes = document.getElementById("mesSelect");
selectMes.selectedIndex = mesActual;
