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

    for (const key in equipo) {
      // Excluir _id y __v
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

    // Agregar botones de eliminación
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";

    // Agregar confirmación al hacer clic en el botón "Eliminar"
    deleteButton.addEventListener("click", () => {
      const confirmacion = window.confirm(
        "¿Estás seguro de que quieres eliminar este equipo?"
      );
      if (confirmacion) {
        deleteEquipo(equipo._id);
      }
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
}

async function deleteEquipo(id) {
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

    // Recargar la página después de la eliminación
    window.location.reload();
  } catch (error) {
    console.error(error.message);
  }
}
