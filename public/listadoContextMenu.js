// listadoContextMenu.js

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
  if (event.target.tagName === "TH") {
    return;
  }

  // Si hay un menú contextual activo, ciérralo antes de abrir uno nuevo
  if (activeContextMenu) {
    activeContextMenu.remove();
  }

  const targetElement = event.target.closest("tr");

  if (targetElement) {
    const equipoId = targetElement.id.split("-")[1];

    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";

    // Cargar el archivo workers.json utilizando fetch
    const response = await fetch("workers.json");
    const workers = await response.json();

    const arregladoSubMenu = document.createElement("div");
    arregladoSubMenu.classList.add("sub-menu", "hover");
    arregladoSubMenu.innerHTML = `
          <span>Visto por<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path  d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
        `;

    // Crear un div contenedor para todos los trabajadores
    const workersContainer = document.createElement("div");

    // Iterar sobre cada objeto de trabajador en el arreglo 'workers'
    workers.forEach((worker) => {
      // Crear un div para cada trabajador
      const workerDiv = document.createElement("div");
      workerDiv.classList.add("hover", "p10");
      // El nombre del trabajador se obtiene del atributo 'nombre' del objeto actual
      workerDiv.textContent = worker.nombre;
      // Asignar un evento 'click' para llamar a la función 'assignedWorker' con los parámetros adecuados
      workerDiv.addEventListener("click", () =>
        assignedWorker(equipoId, worker.nombre)
      );
      // Agregar el div del trabajador al contenedor de trabajadores
      workersContainer.appendChild(workerDiv);
    });

    // Agregar el contenedor de trabajadores al menú contextual
    arregladoSubMenu.appendChild(workersContainer);

    // Agregar el menú contextual completo al menú principal
    contextMenu.appendChild(arregladoSubMenu);

    const estadoSubMenu = document.createElement("div");
    estadoSubMenu.classList.add("sub-menu", "hover");
    estadoSubMenu.innerHTML = `
          <span>Estado<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path  d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
          <div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'No iniciado')">No iniciado</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Iniciado')">Iniciado</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'En espera')">En espera</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Sin arreglo')">Sin arreglo</div>
            <div class="hover p10" onclick="changeStatus('${equipoId}', 'Reparado')">Reparado</div>
          </div>
        `;

    const comentarioSubMenu = document.createElement("div");
    comentarioSubMenu.classList.add("sub-menu", "hover");
    comentarioSubMenu.innerHTML = `
          <span>Comentarios</span>
        `;

    const eliminarEquipoSubMenu = document.createElement("div");
    eliminarEquipoSubMenu.classList.add("sub-menu", "hover", "center");
    eliminarEquipoSubMenu.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" class="dbtn"><path  d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
        `;
    eliminarEquipoSubMenu.addEventListener("click", () => {
      const confirmacion = window.confirm(
        "¿Estás seguro de que quieres eliminar este equipo?"
      );
      if (confirmacion) {
        deleteEquipo(equipoId);
      }
    });

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
                    `<li class="lic" id="comment-${index}" oncontextmenu="showCommentContextMenu(event, '${equipoId}', ${index})">
                    ${comment}
                    <button onclick="deleteComment('${equipoId}', ${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" class="dbtn"><path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                    </button>
                    </li>`
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
    contextMenu.appendChild(comentarioSubMenu);
    contextMenu.appendChild(eliminarEquipoSubMenu);

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

function closeContextMenu(event) {
  // Si se hace clic fuera del menú contextual, ciérralo
  if (activeContextMenu && !activeContextMenu.contains(event.target)) {
    activeContextMenu.remove();
    activeContextMenu = null;
    document.removeEventListener("click", closeContextMenu);
  }
}
