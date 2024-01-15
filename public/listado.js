// listado.js

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/listar-equipos");
    if (!response.ok) {
      throw new Error("Error al obtener la lista de equipos");
    }

    const data = await response.json();
    fillTable(data);
  } catch (error) {
    console.error(error.message);
    // Puedes agregar lógica adicional para manejar el error, como mostrar un mensaje al usuario.
  }
});

function fillTable(data) {
  const table = document.getElementById("equipos-table");
  const tbody = document.createElement("tbody");

  data.forEach((equipo) => {
    const row = document.createElement("tr");

    for (const key in equipo) {
      const cell = document.createElement("td");
      cell.textContent = equipo[key];
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}
