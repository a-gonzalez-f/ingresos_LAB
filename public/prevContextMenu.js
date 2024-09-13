// prevContextMenu.js
let activeContextMenu = null;

const SERVER_URL = "http://172.26.211.60:3000";

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

document
  .getElementById("teaCards")
  .addEventListener("contextmenu", handleContextMenu);
document
  .getElementById("telemandosCards")
  .addEventListener("contextmenu", handleContextMenu);

async function handleContextMenu(event) {
  event.preventDefault();

  if (activeContextMenu) {
    activeContextMenu.remove();
  }

  const contextMenu = document.createElement("div");
  contextMenu.className = "context-menu";

  const targetCard = event.target.closest(".card");
  if (targetCard) {
    const itemId = targetCard.id;
    const itemType = targetCard.closest("#teaCards") ? "tea" : "telemando";
    const itemSystem = targetCard.sistema;
    const itemUnidad = targetCard.unidad;
    const itemWorker = targetCard.trabajador;
    const itemLinea = targetCard.linea;
    console.log(
      itemId,
      itemType,
      itemSystem,
      itemUnidad,
      itemWorker,
      itemLinea
    );

    const dataToSave = {
      itemId,
      itemType,
      itemSystem,
      itemUnidad,
      itemLinea,
      itemWorker,
    };

    localStorage.setItem("contextMenuData", JSON.stringify(dataToSave));

    const savedData = JSON.parse(localStorage.getItem("contextMenuData"));

    if (JSON.stringify(savedData) === JSON.stringify(dataToSave)) {
      console.log("Datos guardados correctamente en localStorage:", savedData);
    } else {
      console.error("Error al guardar los datos en localStorage.");
    }

    const response = await fetch("workers.json");
    const workers = await response.json();

    const arregladoSubMenu = document.createElement("div");
    arregladoSubMenu.classList.add("sub-menu", "hover");
    arregladoSubMenu.innerHTML = `
      <span>Realizado por<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path  d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
    `;

    const comentarioSubMenu = document.createElement("div");
    comentarioSubMenu.classList.add("sub-menu", "hover");
    comentarioSubMenu.innerHTML = `
      <span>Comentarios</span>
    `;

    const parteSubMenu = document.createElement("div");
    parteSubMenu.classList.add("sub-menu", "hover");
    parteSubMenu.innerHTML = `
      <span><a href="./parteForm.html" target="_blank" rel="noopener noreferrer">Parte</a></span>
    `;

    const workersContainer = document.createElement("div");
    workersContainer.classList.add("subMenuLi");

    workers.forEach((worker) => {
      const workerDiv = document.createElement("div");
      workerDiv.classList.add("hover", "p10");
      workerDiv.textContent = worker.nombre;

      workerDiv.addEventListener("click", async () => {
        await assignedWorker(itemId, worker.nombre, itemType);
      });
      workersContainer.appendChild(workerDiv);
    });

    comentarioSubMenu.addEventListener("click", async () => {
      try {
        if (activeContextMenu) {
          activeContextMenu.remove();
          activeContextMenu = null;
        }

        const response = await fetch(
          `${SERVER_URL}/obtener-preventivo/${itemType}/${itemId}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener los detalles del card");
        }

        const cardData = await response.json();
        const {
          linea,
          unidad,
          estado,
          trabajador: rawTrabajador,
          comentarios,
        } = cardData;
        const trabajador = rawTrabajador.filter(
          (element) =>
            element !== null && element !== undefined && element !== ""
        );

        const comentariosCard = document.createElement("div");
        comentariosCard.className = "comments-card";

        const filteredComentarios = comentarios.filter(
          (comment) => comment.trim() !== ""
        );

        comentariosCard.innerHTML = `
          <div>
              <h3>Detalles ${unidad}</h3>        
              <p>Linea: ${linea}</p>
              <p>Estado: ${estado}</p>
              <p>Trabajadores: ${trabajador.join(", ")}</p>
              <p>Comentarios:</p>
              <div class="commentsList">
                <ul>
                    ${filteredComentarios
                      .map(
                        (comment, index) =>
                          `<li class="lic" id="comment-${index}" oncontextmenu="showCommentContextMenu(event, '${itemId}', ${index}, '${itemType}')">
                          ${comment}
                          <button onclick="deleteComment('${itemId}', ${index}, '${itemType}')">
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
              <button onclick="sendComment('${itemId}', '${itemType}')">Añadir</button>
          </div>
        `;

        document.body.appendChild(comentariosCard);

        document.addEventListener("click", closeCommentCard);
      } catch (error) {
        console.error(error.message);
        alert("Error al obtener los detalles del card");
      }
    });

    function closeCommentCard(event) {
      const comentariosCard = document.querySelector(".comments-card");
      if (comentariosCard && !comentariosCard.contains(event.target)) {
        comentariosCard.remove();
        document.removeEventListener("click", closeCommentCard);
      }
    }

    arregladoSubMenu.appendChild(workersContainer);
    contextMenu.appendChild(arregladoSubMenu);
    contextMenu.appendChild(comentarioSubMenu);
    contextMenu.appendChild(parteSubMenu);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let posX = event.clientX + 3;
    if (posX + contextMenu.offsetWidth > viewportWidth - 200) {
      posX = viewportWidth - 200 - contextMenu.offsetWidth;
      workersContainer.style.left = "-96%";
    }
    posX = Math.max(posX, 0);

    const posY = event.clientY + window.scrollY;
    if (posY + contextMenu.offsetHeight > viewportHeight - 300) {
      workersContainer.style.top = "-268px";
    }

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;

    document.body.appendChild(contextMenu);
    activeContextMenu = contextMenu;
  }

  document.addEventListener("click", closeContextMenu);
}

function closeContextMenu(event) {
  if (activeContextMenu && !activeContextMenu.contains(event.target)) {
    activeContextMenu.remove();
    activeContextMenu = null;
    document.removeEventListener("click", closeContextMenu);
  }
}

async function assignedWorker(itemId, worker, itemType) {
  const endpoint =
    itemType === "tea"
      ? `${SERVER_URL}/asignar-trabajador-tea/${itemId}`
      : `${SERVER_URL}/asignar-trabajador-telemando/${itemId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trabajador: worker }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    window.location.reload();
  } catch (error) {
    console.error(error.message);
    alert("Error al asignar el trabajador");
  }
}

async function sendComment(itemId, itemType) {
  const commentText = document.getElementById("commentText").value;

  if (commentText.trim() === "") {
    alert("El comentario está vacío");
    return;
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const response = await fetch(
    `${SERVER_URL}/enviar-comentario/${itemType}/${itemId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comentario: `<p>${commentText}</p>
        <div class="divDate">
          <span class="dateSpan">${formattedDate}</span>
          <span class="timeSpan">${formattedTime}</span>
        </div>`,
      }),
    }
  );

  if (response.ok) {
    window.location.reload();
  } else {
    console.error("Error al enviar el comentario a la base de datos");
  }
}

async function deleteComment(itemId, index, itemType) {
  const confirmacion = window.confirm(
    "¿Estás seguro de que quieres eliminar este comentario?"
  );

  if (confirmacion) {
    try {
      const response = await fetch(
        `${SERVER_URL}/eliminar-comentario/${itemType}/${itemId}/${index}`,
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
