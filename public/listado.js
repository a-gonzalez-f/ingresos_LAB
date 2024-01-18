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
        // Formatear fecha si la clave es "fechaIngreso"
        if (key === "fechaIngreso") {
          cell.textContent = formatDate(equipo[key]);
        } else {
          cell.textContent = equipo[key];
        }
        row.appendChild(cell);
      }
    }

    // Nueva celda para el botón de eliminación
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => {
      deleteEquipo(equipo._id);
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // Nueva celda para la casilla de verificación
    const checkboxCell = document.createElement("td");
    checkboxCell.classList.add("checkbox-cell"); // Agrega la clase
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = equipo._id; // Puedes usar el ID como valor
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

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
