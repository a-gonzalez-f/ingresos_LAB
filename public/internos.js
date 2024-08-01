// internos.js
document.addEventListener("DOMContentLoaded", async function () {
  const SERVER_URL = "http://172.26.211.60:3000";
  try {
    const response = await fetch(`${SERVER_URL}/listar-internos`);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de internos");
    }

    const data = await response.json();
    fillTable(data);

    const dataTable = $("#internos-table").DataTable({
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
        url: `${SERVER_URL}/listar-internos`,
        dataSrc: "",
      },
      columns: [
        { data: "LINEA" },
        { data: "REFERENCIA 1" },
        { data: "REFERENCIA 2" },
        { data: "INTERNO" },
      ],
    });

    // Evento search.dt se dispara después de cada búsqueda
    dataTable.on("search.dt", function () {
      // Verificar si la búsqueda está vacía
      const isEmpty = !dataTable.search();

      // Mostrar u ocultar la tabla según si la búsqueda está vacía
      $("#internos-table").css("display", isEmpty ? "none" : "table");
    });

    // Evento preDraw.dt se dispara antes de redibujar la tabla
    dataTable.on("preDraw.dt", function () {
      // Verificar si la búsqueda está vacía
      const isEmpty = !dataTable.search();

      // Mostrar u ocultar la tabla según si la búsqueda está vacía
      $("#internos-table").css("display", isEmpty ? "none" : "table");
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
