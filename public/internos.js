// internos.js
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/listar-internos");
    if (!response.ok) {
      throw new Error("Error al obtener la lista de internos");
    }

    const data = await response.json();
    fillTable(data);

    $("#internos-table").DataTable({
      paging: false,
      ordering: false,
      info: false,
      searching: true,
      language: {
        search: "Buscar:",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
      },
      ajax: {
        url: "http://localhost:3000/listar-internos",
        dataSrc: "",
      },
      columns: [
        { data: "LINEA" },
        { data: "REFERENCIA 1" },
        { data: "REFERENCIA 2" },
        { data: "INTERNO" },
      ],
    });
  } catch (error) {
    console.error(error.message);
  }
});

function fillTable(data) {
  const table = document.getElementById("internos-table");
  const tbody = document.createElement("tbody");

  data.forEach((interno) => {
    const row = document.createElement("tr");
    const columns = ["LINEA", "REFERENCIA 1", "REFERENCIA 2", "INTERNO"];

    for (const key in interno) {
      if (key !== "_id") {
        const cell = document.createElement("td");
        cell.textContent = interno[key] || "";
        row.appendChild(cell);
      }
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}
