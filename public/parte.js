document.addEventListener("DOMContentLoaded", function () {
  const formData = JSON.parse(localStorage.getItem("formData"));

  if (formData) {
    document.getElementById("fechaPlanificada").textContent =
      formData.fechaPlanificada;
    document.getElementById("fechaRealizada").textContent =
      formData.fechaRealizada;
    document.getElementById("unidadMantenimiento").textContent =
      formData.unidadMantenimiento;
    document.getElementById("traslado-desde").textContent =
      formData["traslado-desde"];
    document.getElementById("traslado-hasta").textContent =
      formData["traslado-hasta"];
    document.getElementById("inicio").textContent = formData.inicio;
    document.getElementById("final").textContent = formData.final;
    document.getElementById("tarea-trabajo").textContent =
      formData["tareaTrabajo"];
    document.getElementById("observaciones").textContent =
      formData.observaciones;

    const trabajadoresTable = document.getElementById("trabajadores");
    formData.workers.forEach((worker, index) => {
      if (worker.legajo && worker.nombre) {
        const row = trabajadoresTable.insertRow();
        row.innerHTML = `
          <td>${worker.legajo}</td>
          <td>${worker.nombre}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        `;
      }
    });

    const firmasContainer = document.getElementById("firmasWorkers");
    formData.workers.forEach((worker) => {
      if (worker.legajo && worker.nombre) {
        const firmaDiv = document.createElement("div");
        firmaDiv.classList.add("f");
        firmaDiv.innerHTML = `
          <div class="firma">
            <img src="img/firmas/${worker.nombre}.png" alt="Firma de ${worker.nombre}">
          </div>
          <div>
            <span>${worker.nombre}</span>
            <p>Nombre</p>
          </div>
          <div>
            <span>${worker.legajo}</span>
            <p>Legajo</p>
          </div>
        `;
        firmasContainer.appendChild(firmaDiv);
      }
    });

    localStorage.removeItem("formData");
  }

  const tareaTrabajo = document.getElementById("tarea-trabajo");
  const tbodyA1 = document.querySelector(".A1");
  const tbodyC1 = document.querySelector(".C1");
  const tbodyC3 = document.querySelector(".C3");
  const toggleElement = document.querySelector(".toggle");

  function updateDisplay() {
    const tareaText = tareaTrabajo.textContent.trim();

    tbodyA1.style.display = "none";
    tbodyC1.style.display = "none";
    tbodyC3.style.display = "none";

    if (tareaText === "C1 - Telemandos Aux.") {
      tbodyC1.style.display = "table-row-group";
    } else if (tareaText === "C3 - Telemandos Subest.") {
      tbodyC3.style.display = "table-row-group";
    } else if (tareaText === "A1 - Carteles TEA") {
      tbodyA1.style.display = "table-row-group";
    }

    if (tareaText === "TE - Tarea Eventual") {
      toggleElement.style.display = "none";
    } else {
      toggleElement.style.display = "";
    }
  }

  updateDisplay();

  const observer = new MutationObserver(updateDisplay);
  observer.observe(tareaTrabajo, { childList: true, subtree: true });
});

function descargarParte() {
  const element = document.getElementById("content");
  const formData = JSON.parse(localStorage.getItem("formData"));
  const fechaRealizada = formData
    ? formData.fechaRealizada
    : new Date().toISOString().slice(0, 10);
  const opt = {
    margin: 1,
    filename: `Parte-de-Trabajo-${fechaRealizada}.pdf`,
    html2canvas: { scale: 2 },
    image: { type: "jpeg", quality: 0.99 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };
  html2pdf().set(opt).from(element).save();
}
