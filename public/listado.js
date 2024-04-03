// listado.js

// Variable para mantener una referencia al menú contextual actualmente abierto
let activeContextMenu = null;

document.addEventListener("contextmenu", function (event) {
  // Prevenir el comportamiento por defecto del menú contextual
  event.preventDefault();
});

document
  .getElementById("equipos-table")
  .addEventListener("contextmenu", handleContextMenu);

async function handleContextMenu(event) {
  event.preventDefault();

  // Si hay un menú contextual activo, ciérralo antes de abrir uno nuevo
  if (activeContextMenu) {
    activeContextMenu.remove();
  }

  const targetElement = event.target.closest("tr");

  if (targetElement) {
    const equipoId = targetElement.id.split("-")[1];

    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";

    const estadoSubMenu = document.createElement("div");
    estadoSubMenu.classList.add("sub-menu", "hover");
    estadoSubMenu.innerHTML = `
          <span>Estado<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path fill="currentColor" d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
          <div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'No iniciado')">No iniciado</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Iniciado')">Iniciado</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'En espera')">En espera</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Sin arreglo')">Sin arreglo</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Reparado')">Reparado</div>
          </div>
        `;

    const arregladoSubMenu = document.createElement("div");
    arregladoSubMenu.classList.add("sub-menu", "hover");
    arregladoSubMenu.innerHTML = `
          <span>Visto por<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path fill="currentColor" d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
          <div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Agus')">Agus</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Dani')">Dani</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Fede')">Fede</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Junmi')">Junmi</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Pablo')">Pablo</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Pedro')">Pedro</div>
            <div class="hover p10" onclick="assignedWorker('${equipoId}', 'Sergio')">Sergio</div>
          </div>
        `;

    const comentarioSubMenu = document.createElement("div");
    comentarioSubMenu.classList.add("sub-menu", "hover");
    comentarioSubMenu.innerHTML = `
          <span>Comentarios</span>
        `;

    comentarioSubMenu.addEventListener("click", async () => {
      // Cierra el menú contextual
      if (activeContextMenu) {
        activeContextMenu.remove();
        activeContextMenu = null;
      }
      // Obtener datos necesarios para el comentarioCard
      const response = await fetch(
        `http://localhost:3000/obtener-equipo/${equipoId}`
      );
      const equipoData = await response.json();
      const {
        equipo,
        marca,
        fechaIngreso,
        nSerie,
        falla,
        trabajador,
        estado,
        comentarios,
      } = equipoData;

      // Crear el comentarioCard
      const comentariosCard = document.createElement("div");
      comentariosCard.className = "comments-card";

      // Crear y agregar contenido al comentarioCard
      comentariosCard.innerHTML = `
    <div>
        <h3>Detalles ${equipo}</h3>        
        <p>Marca: ${marca}</p>
        <p>Fecha de Ingreso: ${formatDate(fechaIngreso)}</p>
        <p>N° Serie: ${nSerie}</p>
        <p>Falla: ${falla}</p>
        <p>Visto por: ${trabajador}</p>
        <p>Estado: ${estado}</p>
        <p>Comentarios:</p>
        <div class="commentsList">
          <ul>
              ${comentarios
                .map(
                  (comment, index) =>
                    `<li class="lic" id="comment-${index}" oncontextmenu="showCommentContextMenu(event, '${equipoId}', ${index})">${comment}</li>`
                )
                .join("")}
          </ul>
        </div>
    </div>
    <div id="inputComment">
        <input type="text" id="commentText" placeholder="Escribe tu comentario aquí">
        <button onclick="sendComment('${equipoId}')">Añadir</button>
    </div>
`;

      document.body.appendChild(comentariosCard);

      // Agregar un event listener para cerrar el comentarioCard al hacer clic fuera de él
      document.addEventListener("click", closeCommentCard);
    });

    function closeCommentCard(event) {
      const comentariosCard = document.querySelector(".comments-card");
      if (comentariosCard && !comentariosCard.contains(event.target)) {
        comentariosCard.remove();
        document.removeEventListener("click", closeCommentCard);
      }
    }

    contextMenu.appendChild(estadoSubMenu);
    contextMenu.appendChild(arregladoSubMenu);
    contextMenu.appendChild(comentarioSubMenu);

    const posX = event.clientX + 3;
    const posY = event.clientY + window.scrollY;

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;

    document.body.appendChild(contextMenu);
    activeContextMenu = contextMenu;
  }

  // Agregar un event listener para cerrar el menú contextual al hacer clic en cualquier parte del documento
  document.addEventListener("click", closeContextMenu);
}

let contextMenu = null;

function showCommentContextMenu(event, equipoId, index) {
  if (contextMenu !== null) {
    contextMenu.remove(); // Si ya hay un menú abierto, cerrarlo
  }

  event.preventDefault();

  contextMenu = document.createElement("div");
  contextMenu.className = "context-menu";
  contextMenu.innerHTML = `
    <div class="sub-menu dc" onclick="deleteComment('${equipoId}', ${index})">Eliminar</div>
  `;

  const posX = event.clientX + 3;
  const posY = event.clientY + window.scrollY;

  contextMenu.style.left = `${posX}px`;
  contextMenu.style.top = `${posY}px`;

  document.body.appendChild(contextMenu);

  // Remover el menú contextual cuando se haga clic en cualquier parte del documento
  const removeContextMenu = () => {
    contextMenu.remove();
    contextMenu = null;
    document.removeEventListener("click", removeContextMenu);
  };

  document.addEventListener("click", removeContextMenu);
}

async function deleteComment(equipoId, index) {
  const confirmacion = window.confirm(
    "¿Estás seguro de que quieres eliminar este comentario?"
  );

  if (confirmacion) {
    try {
      const response = await fetch(
        `http://localhost:3000/eliminar-comentario/${equipoId}/${index}`,
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

function closeContextMenu(event) {
  // Si se hace clic fuera del menú contextual, ciérralo
  if (activeContextMenu && !activeContextMenu.contains(event.target)) {
    activeContextMenu.remove();
    activeContextMenu = null;
    document.removeEventListener("click", closeContextMenu);
  }
}

const columnVisibility = [
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
  true, // 12: Eliminar
  true, // 13: Checkbox
];

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

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        eliminarButton.classList.add("marcado");
      } else {
        eliminarButton.classList.remove("marcado");
      }
    });
  });
});

function toggleColumn(columnIndex) {
  columnVisibility[columnIndex] = !columnVisibility[columnIndex];
  $("#equipos-table")
    .DataTable()
    .column(columnIndex)
    .visible(columnVisibility[columnIndex]);

  const buttonText = columnVisibility[columnIndex] ? "Ocultar" : "Mostrar";
  $(`#toggleBtn-${columnIndex}`).text(buttonText);
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

async function changeStatus(equipoId, nuevoEstado) {
  try {
    const response = await fetch(
      `http://localhost:3000/cambiar-estado/${equipoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      }
    );

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
      `http://localhost:3000/asignar-trabajador/${equipoId}`,
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

  // Enviar el comentario a la base de datos
  const response = await fetch(
    `http://localhost:3000/enviar-comentario/${equipoId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comentario: commentText }),
    }
  );

  // Verificar si la operación fue exitosa
  if (response.ok) {
    window.location.reload();
  } else {
    // Manejar el error en caso de que la operación no sea exitosa
    console.error("Error al enviar el comentario a la base de datos");
  }
}
