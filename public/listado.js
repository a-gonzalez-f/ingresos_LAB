// listado.js
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:3000/listar-equipos");
    if (!response.ok) {
      throw new Error("Error al obtener la lista de equipos");
    }

    const data = await response.json();
    fillTable(data);
    $("#equipos-table").DataTable({
      paging: false,
      ordering: true,
      info: false,
      searching: true,
      language: {
        search: "Buscar:",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
      },
      columnDefs: [
        { orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11] }, // columnas no ordenables
      ],
    });
  } catch (error) {
    console.error(error.message);
  }
});

function formatDate(dateString) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };
  return new Date(dateString).toLocaleDateString("es-AR", options);
}

function fillTable(data) {
  const table = document.getElementById("equipos-table");
  const tbody = document.createElement("tbody");

  data.forEach((equipo) => {
    const row = document.createElement("tr");

    // Resto de las celdas (excluir _id y __v)
    for (const key in equipo) {
      if (key !== "_id" && key !== "__v") {
        const cell = document.createElement("td");
        const contentDiv = document.createElement("div");

        // Formatear fecha si la clave es "fechaIngreso"
        if (key === "fechaIngreso") {
          contentDiv.textContent = formatDate(equipo[key]);
        } else {
          contentDiv.textContent = equipo[key];

          // Agregar clase al div según el valor de la propiedad "linea"
          if (key === "linea") {
            contentDiv.classList.add(equipo[key], "circle");

            if (equipo[key] === "N/A") {
              contentDiv.classList.add("n-a");
            }
          }
        }

        cell.appendChild(contentDiv);
        row.appendChild(cell);
      }
    }

    // Nueva celda para el botón de eliminación
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>';
    deleteButton.addEventListener("click", () => {
      deleteEquipo(equipo._id);
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    const checkboxCell = document.createElement("td");
    checkboxCell.classList.add("checkbox-cell");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = equipo._id;
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        row.classList.add("marcada");
      } else {
        row.classList.remove("marcada");
      }
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}

let deleteConfirmationReceived = false;

async function deleteEquipo(id) {
  if (!deleteConfirmationReceived) {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres eliminar este equipo?"
    );

    if (!confirmacion) {
      return;
    }
  }

  try {
    const response = await fetch(
      `http://localhost:3000/eliminar-equipo/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el equipo");
    }

    // Si se ha confirmado la eliminación de los equipos seleccionados, no mostrar más confirmaciones
    if (deleteConfirmationReceived) {
      deleteConfirmationReceived = false;
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error.message);
    alert("Error al eliminar el equipo");
  }
}

function deleteSelectedEquipos() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const equipoIds = Array.from(checkboxes).map((checkbox) => checkbox.value);

  if (equipoIds.length === 0) {
    alert("Selecciona al menos un equipo para eliminar.");
    return;
  }

  const confirmacion = window.confirm(
    "¿Estás seguro de que quieres eliminar los equipos seleccionados?"
  );

  if (confirmacion) {
    deleteConfirmationReceived = true;
    equipoIds.forEach((equipoId) => deleteEquipo(equipoId));
  }
}
