// prevContextMenu.js

let activeContextMenu = null;

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
    const itemType = targetCard.closest("#teaCards") ? "tea" : "telemando"; // Detectar tipo de item
    console.log(itemId, itemType);

    // Cargar el archivo workers.json utilizando fetch
    const response = await fetch("workers.json");
    const workers = await response.json();

    const arregladoSubMenu = document.createElement("div");
    arregladoSubMenu.classList.add("sub-menu", "hover");
    arregladoSubMenu.innerHTML = `
      <span>Realizado por<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="arrow" viewBox="0 0 1024 1024"><path  d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"/></svg></span>
    `;
    // Crear un div contenedor para todos los trabajadores
    const workersContainer = document.createElement("div");

    // Iterar sobre cada objeto de trabajador en el arreglo 'workers'
    workers.forEach((worker) => {
      const workerDiv = document.createElement("div");
      workerDiv.classList.add("hover", "p10");
      workerDiv.textContent = worker.nombre;

      workerDiv.addEventListener("click", async () => {
        await assignedWorker(itemId, worker.nombre, itemType);
      });
      workersContainer.appendChild(workerDiv);
    });

    arregladoSubMenu.appendChild(workersContainer);

    contextMenu.appendChild(arregladoSubMenu);

    // Add more submenus or actions as needed

    const posX = event.clientX + 3;
    const posY = event.clientY + window.scrollY;

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
      ? `http://localhost:3000/asignar-trabajador-tea/${itemId}`
      : `http://localhost:3000/asignar-trabajador-telemando/${itemId}`;

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
