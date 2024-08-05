// listado.js

let columnVisibility = [
  true, // 0: Ingreso
  false, // 1: Ingresado por
  false, // 2: Email
  false, // 3: Interno
  true, // 4: Equipo
  true, // 5: Marca
  false, // 6: N° Serie
  true, // 7: Descripción de la Falla
  true, // 8: Línea
  false, // 9: Sector
  false, // 10: Trabajador
  true, // 11: Estado
  false, // 12: Eliminar
  true, // 13: Checkbox
];

const SERVER_URL = "http://172.26.211.60:3000";
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(`${SERVER_URL}/listar-equipos`);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de equipos");
    }

    const data = await response.json();
    fillTable(data);

    const storedVisibility = localStorage.getItem("columnVisibility");
    if (storedVisibility) {
      columnVisibility = JSON.parse(storedVisibility);
    }

    columnVisibility.forEach((visible, index) => {
      const buttonText = visible ? "Ocultar" : "Mostrar";
      $(`#toggleBtn-${index}`).text(buttonText);
    });

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
        { orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 9, 12, 13] }, // columnas no ordenables
        { visible: columnVisibility[0], targets: 0 }, // fecha
        { visible: columnVisibility[1], targets: 1 }, // ingresó
        { visible: columnVisibility[2], targets: 2 }, // email
        { visible: columnVisibility[3], targets: 3 }, // interno
        { visible: columnVisibility[4], targets: 4 }, // equipo
        { visible: columnVisibility[5], targets: 5 }, // marca
        { visible: columnVisibility[6], targets: 6 }, // nserie
        { visible: columnVisibility[7], targets: 7 }, // descripcion
        { visible: columnVisibility[8], targets: 8 }, // linea
        { visible: columnVisibility[9], targets: 9 }, // sector
        { visible: columnVisibility[10], targets: 10 }, // trabajador
        { visible: columnVisibility[11], targets: 11 }, // estado
        { visible: columnVisibility[12], targets: 12 }, // eliminar
        { visible: columnVisibility[13], targets: 13 }, // checkbox
      ],
      autoWidth: false,
    });
  } catch (error) {
    console.error(error.message);
  }

  const checkboxes = document.querySelectorAll(
    '.checkbox-cell input[type="checkbox"]'
  );
  const eliminarButton = document.querySelector(".eliminarbutton");

  function actualizarEstadoBoton() {
    // Verificar si algún checkbox está marcado
    const algunCheckboxMarcado = Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );

    // Si no hay ningún checkbox marcado, quitar la clase 'marcado' del botón
    if (!algunCheckboxMarcado) {
      eliminarButton.classList.remove("marcado");
    } else {
      eliminarButton.classList.add("marcado");
    }
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", actualizarEstadoBoton);
  });

  actualizarEstadoBoton();
});

function toggleColumn(columnIndex) {
  columnVisibility[columnIndex] = !columnVisibility[columnIndex];
  $("#equipos-table")
    .DataTable()
    .column(columnIndex)
    .visible(columnVisibility[columnIndex]);

  const buttonText = columnVisibility[columnIndex] ? "Ocultar" : "Mostrar";
  $(`#toggleBtn-${columnIndex}`).text(buttonText);

  localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
}

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
    row.id = `equipo-${equipo._id}`;

    // Agregar una clase al tr según el estado actual del equipo
    row.classList.add(equipo.estado.toLowerCase().replace(" ", "-"));

    // Resto de las celdas (excluir _id , __v , comentarios)
    for (const key in equipo) {
      if (key !== "_id" && key !== "__v" && key !== "comentarios") {
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

    // Celda para el botón de eliminación
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path  d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>';
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
  try {
    const response = await fetch(`${SERVER_URL}/eliminar-equipo/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el equipo");
    }

    // Actualizar la tabla dinámicamente en lugar de recargar la página
    $(`#equipo-${id}`).remove();

    // Si se ha confirmado la eliminación de los equipos seleccionados, no mostrar más confirmaciones
    // if (deleteConfirmationReceived) {
    //   deleteConfirmationReceived = false;
    // } else {
    //   window.location.reload();
    // }
  } catch (error) {
    console.error(error.message);
    alert("Error al eliminar el equipo");
  }
}

async function deleteSelectedEquipos() {
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

    for (const equipoId of equipoIds) {
      await deleteEquipo(equipoId);
    }

    deleteConfirmationReceived = false; // Restablecer la confirmación
  }
  // if (confirmacion) {
  //   deleteConfirmationReceived = true;
  //   equipoIds.forEach((equipoId) => deleteEquipo(equipoId));
  //   window.location.reload();
  // }
}

async function changeStatus(equipoId, nuevoEstado) {
  try {
    const response = await fetch(`${SERVER_URL}/cambiar-estado/${equipoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar el estado del equipo");
    }

    window.location.reload();
  } catch (error) {
    console.error(error.message);
    alert("Error al cambiar el estado del equipo");
  }
}

async function assignedWorker(equipoId, worker) {
  try {
    const response = await fetch(
      `${SERVER_URL}/asignar-trabajador/${equipoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trabajador: worker }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al asignar el trabajador al equipo");
    }

    window.location.reload();
  } catch (error) {
    console.error(error.message);
    alert("Error al asignar el trabajador al equipo");
  }
}

function filterByEstado() {
  const selectedEstado = document.getElementById("estadoFilter").value;
  const table = $("#equipos-table").DataTable();

  if (selectedEstado === "") {
    table.columns(11).search("").draw();
  } else {
    table.columns(11).search(`^${selectedEstado}$`, true, false).draw();
  }
}

// Función para enviar el comentario a la base de datos
async function sendComment(equipoId) {
  const commentText = document.getElementById("commentText").value;

  // Verificar si el comentario está vacío
  if (commentText.trim() === "") {
    alert("El comentario está vacío");
    return;
  }

  // Obtener la fecha actual
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Formatear los minutos para asegurarse de que tenga dos dígitos
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Crear la cadena de fecha formateada
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${formattedMinutes}`;

  // Crear un div para contener la fecha y el horario
  const divDate = document.createElement("div");
  divDate.classList.add("divDate");

  // Crear un span para mostrar la fecha
  const dateSpan = document.createElement("span");
  dateSpan.classList.add("dateSpan");
  dateSpan.textContent = formattedDate;

  // Crear un span para mostrar el horario
  const timeSpan = document.createElement("span");
  timeSpan.classList.add("timeSpan");
  timeSpan.textContent = formattedTime;

  // Agregar los spans al div
  divDate.appendChild(dateSpan);
  divDate.appendChild(timeSpan);

  // Crear un span para mostrar el comentario
  const commentSpan = document.createElement("span");
  commentSpan.textContent = commentText;

  // Enviar el comentario a la base de datos
  const response = await fetch(`${SERVER_URL}/enviar-comentario/${equipoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comentario: `${divDate.outerHTML} ${commentSpan.outerHTML}`,
    }),
  });

  // Verificar si la operación fue exitosa
  if (response.ok) {
    window.location.reload();
  } else {
    // Manejar el error en caso de que la operación no sea exitosa
    console.error("Error al enviar el comentario a la base de datos");
  }
}

async function deleteComment(equipoId, index) {
  const confirmacion = window.confirm(
    "¿Estás seguro de que quieres eliminar este comentario?"
  );

  if (confirmacion) {
    try {
      const response = await fetch(
        `${SERVER_URL}/eliminar-comentario/${equipoId}/${index}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
      alert("Error al eliminar el comentario");
    }
  }
}
