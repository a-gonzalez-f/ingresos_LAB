document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/listar-radios");
    const radios = await response.json();

    const radiosCards = document.getElementById("radiosCards");
    radios.forEach((radio) => {
      const radioCard = document.createElement("div");
      radioCard.classList.add("card");
      radioCard.classList.add(radio.estadoTT);
      radioCard.innerHTML = `
        ${
          radio.lineaTT !== "N/A"
            ? `
          <div class="linea">
            <p class="circle ${radio.lineaTT}"> ${radio.lineaTT}</p>
          </div>
        `
            : ""
        }
        <div class="info">
          <p class="unidad"> ${radio.aliasTT}</p>
          <p> ${radio.idTT}</p>
          ${
            radio.modeloRadio && radio.modeloRadio !== "N/A"
              ? `<p>${radio.modeloRadio}</p>`
              : ""
          }
        </div>
        <div class="detContainer">
          <div class="detalles">
            <div>
            ${
              radio.nSerieTT && radio.nSerieTT !== "N/A"
                ? `<p>${radio.nSerieTT}</p>`
                : ""
            }
            ${
              radio.modeloTT && radio.modeloTT !== "N/A"
                ? `<p>${radio.modeloTT}</p>`
                : ""
            }
            ${
              radio.formacionTT && radio.formacionTT !== "N/A"
                ? `<p>Formación ${radio.formacionTT}</p>`
                : ""
            }
            ${
              radio.cabinaTT && radio.cabinaTT !== "N/A"
                ? `<p>Cabina ${radio.cabinaTT}</p>`
                : ""
            }
            ${
              radio.sectorTT && radio.sectorTT !== "N/A"
                ? `<p>${radio.sectorTT}</p>`
                : ""
            }
            ${
              radio.ubicacionTT && radio.ubicacionTT !== "N/A"
                ? `<p>${radio.ubicacionTT}</p>`
                : ""
            }
            </div>
            <div class="accesorios">
              <p class="amtm"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.microfonoTT
              }"><title>Micrófono</title><path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/></svg></p>
              <p class="amtm"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.parlanteTT
              }"><title>Parlante</title><path d="M640-440v-80h160v80H640Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM120-360v-240h160l200-200v640L280-360H120Zm280-246-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg></p>
              <p class="amtm"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.fuenteTT
              }"><title>Fuente</title><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z"/></svg></p>
              <p class="amtm"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.antenaTT
              }"><title>Antena</title><path d="M40-480q0-92 34.5-172T169-791.5q60-59.5 140-94T480-920q91 0 171 34.5t140 94Q851-732 885.5-652T920-480h-80q0-75-28.5-140.5T734-735q-49-49-114.5-77T480-840q-74 0-139.5 28T226-735q-49 49-77.5 114.5T120-480H40Zm160 0q0-118 82-199t198-81q116 0 198 81t82 199h-80q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480h-80ZM360-64l-56-56 136-136v-132q-27-12-43.5-37T380-480q0-42 29-71t71-29q42 0 71 29t29 71q0 30-16.5 55T520-388v132l136 136-56 56-120-120L360-64Z"/></svg></p>
              <p class="amtp"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.bateriaTT
              }"><title>Batería</title><path d="M660-80v-120H560l140-200v120h100L660-80Zm-300-80Zm-40 80q-17 0-28.5-11.5T280-120v-640q0-17 11.5-28.5T320-800h80v-80h160v80h80q17 0 28.5 11.5T680-760v280q-21 0-41 3.5T600-466v-254H360v560h94q8 23 19.5 43T501-80H320Z"/></svg></p>
              <p class="amtp"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="${
                radio.pttTT
              }"><title>PTT</title><path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg></p>
            </div>
          </div>
          <div class="RSubMenu">
            <div class="comments" id="comments-${radio.idTT}">Comentarios</div>
            <div class="editar" id="edit-${radio.idTT}">Editar</div>
          </div>
        `;

      radiosCards.appendChild(radioCard);

      const mtp = radioCard.querySelectorAll(".amtp");
      const mtm = radioCard.querySelectorAll(".amtm");

      if (radio.modeloRadio === "MTM5400" || radio.modeloRadio === "MTM800e") {
        mtp.forEach((element) => (element.style.display = "none"));
        mtm.forEach((element) => (element.style.display = "block"));
      } else if (
        radio.modeloRadio === "MTP3250" ||
        radio.modeloRadio === "MTP850"
      ) {
        mtp.forEach((element) => (element.style.display = "block"));
        mtm.forEach((element) => (element.style.display = "none"));
      }

      radioCard.addEventListener("contextmenu", (event) => {
        event.preventDefault();

        document.querySelectorAll(".detContainer").forEach((detContainer) => {
          detContainer.style.display = "none";
        });

        const detContainer = radioCard.querySelector(".detContainer");
        detContainer.style.display = "flex";
        detContainer.style.position = "absolute";
        detContainer.style.left = `${event.pageX}px`;
        detContainer.style.top = `${event.pageY}px`;
      });

      document
        .getElementById(`comments-${radio.idTT}`)
        .addEventListener("click", () => {
          const commentsCard = document.createElement("div");
          const detContainer = radioCard.querySelector(".detContainer");
          commentsCard.classList.add("comments-card");
          detContainer.style.display = "none";

          const detailsDiv = document.createElement("div");
          detailsDiv.innerHTML = `
          <h3>Detalles ${radio.aliasTT}</h3>        
          <p>ID: ${radio.idTT}</p>
          <p>N° Serie: ${radio.nSerieTT}</p>
          <p>Linea: ${radio.lineaTT || "N/A"}</p>
          <p>Comentarios:</p>
        `;

          const commentsList = document.createElement("div");
          commentsList.classList.add("commentsList");
          const ul = document.createElement("ul");
          ul.id = `comments-${radio.idTT}`;

          if (radio.comentarios && radio.comentarios.length > 0) {
            radio.comentarios.forEach((comment, i) => {
              const li = document.createElement("li");
              li.classList.add("lic");
              li.id = `comment-${i}`;
              li.innerHTML = `<p>${comment}</p>
              <button onclick="deleteRadioComment('${radio.idTT}', '${i}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" class="dbtn"><path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
              </button>`;
              ul.appendChild(li);
            });
          } else {
            ul.innerHTML = `<li>No hay comentarios disponibles.</li>`;
          }

          commentsList.appendChild(ul);

          const inputCommentDiv = document.createElement("div");
          inputCommentDiv.id = "inputComment";
          inputCommentDiv.innerHTML = `
          <input type="text" id="commentText-${radio.idTT}" placeholder="Escribe tu comentario aquí">
          <button onclick="sendComment('${radio.idTT}')">Añadir</button>
        `;

          commentsCard.appendChild(detailsDiv);
          commentsCard.appendChild(commentsList);
          commentsCard.appendChild(inputCommentDiv);
          document.body.appendChild(commentsCard);
        });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".detContainer")) {
        document.querySelectorAll(".detContainer").forEach((detContainer) => {
          detContainer.style.display = "none";
        });
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !event.target.closest(".comments-card") &&
        !event.target.closest(".comments")
      ) {
        const commentsCards = document.querySelectorAll(".comments-card");
        commentsCards.forEach((card) => card.remove());
      }
    });
  } catch (error) {
    console.error("Error al obtener los radios:", error);
  }
});

async function sendComment(radioId) {
  const commentText = document.getElementById(`commentText-${radioId}`).value;

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

  try {
    const response = await fetch(`/enviar-comment-radio/${radioId}`, {
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
    });

    if (response.ok) {
      window.location.reload();
      document.getElementById(`commentText-${radioId}`).value = "";
    } else {
      console.error("Error al enviar el comentario a la base de datos");
    }
  } catch (error) {
    console.error("Error al enviar el comentario:", error);
  }
}

async function deleteRadioComment(radioId, commentIndex) {
  const confirmacion = window.confirm(
    "¿Estás seguro de que quieres eliminar este comentario?"
  );
  if (confirmacion) {
    try {
      const response = await fetch(
        `/eliminar-comment-radio/${radioId}/${commentIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el comentario");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  }
}
