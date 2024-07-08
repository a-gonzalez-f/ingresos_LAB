document.addEventListener("DOMContentLoaded", function () {
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var dd = String(today.getDate()).padStart(2, "0");

  var todayStr = yyyy + "-" + mm + "-" + dd;

  document.getElementById("fechaPlanificada").value = todayStr;
  document.getElementById("fechaRealizada").value = todayStr;

  document.getElementById("inicio").addEventListener("change", calculateHours);
  document.getElementById("final").addEventListener("change", calculateHours);

  function calculateHours() {
    var inicio = document.getElementById("inicio").value;
    var final = document.getElementById("final").value;

    if (inicio && final) {
      var start = new Date(`1970-01-01T${inicio}:00`);
      var end = new Date(`1970-01-01T${final}:00`);
      var diff = (end - start) / (1000 * 60 * 60);

      if (diff < 0) {
        diff += 24;
      }

      document.getElementById("tmp-asgn-tareas-1").value = diff;
      document.getElementById("tmp-ejct-tareas-1").value =
        document.getElementById("tmp-asgn-tareas-1").value;
    }
  }

  document
    .getElementById("tmp-asgn-tareas-1")
    .addEventListener("input", function () {
      document.getElementById("tmp-ejct-tareas-1").value = this.value;
    });

  document
    .getElementById("tmp-asgn-traslado-1")
    .addEventListener("input", function () {
      document.getElementById("tmp-ejct-traslado-1").value = this.value;
    });

  fetch("workers.json")
    .then((response) => response.json())
    .then((data) => {
      window.trabajadores = data;
      initLegajoListeners();
    });
});

function fillLegajosDatalist(workers) {
  const datalist = document.getElementById("legajos-list");
  workers.forEach((worker) => {
    const option = document.createElement("option");
    option.value = worker.legajo;
    datalist.appendChild(option);
  });
}

function initLegajoListeners() {
  document.querySelectorAll(".legajo").forEach((input) => {
    input.addEventListener("input", function () {
      const legajoValue = parseInt(this.value, 10);
      const nameInput = document.getElementById(
        `nombre-${this.id.split("-")[1]}`
      );

      if (this.value === "") {
        nameInput.value = "";
      } else {
        const trabajador = window.trabajadores.find(
          (t) => t.legajo === legajoValue
        );

        if (trabajador) {
          nameInput.value = `${trabajador.nombre} ${trabajador.apellido}`;
        } else {
          nameInput.value = "";
        }
      }
    });

    // Mostrar datalist cuando se ingresan al menos dos caracteres
    input.addEventListener("input", function () {
      const legajoValue = this.value.trim();

      if (legajoValue.length >= 2) {
        const datalist = document.getElementById("legajos-list");
        datalist.innerHTML = "";

        const filteredWorkers = window.trabajadores.filter((t) =>
          t.legajo.toString().startsWith(legajoValue)
        );

        filteredWorkers.forEach((worker) => {
          const option = document.createElement("option");
          option.value = worker.legajo;
          datalist.appendChild(option);
        });
      } else {
        const datalist = document.getElementById("legajos-list");
        datalist.innerHTML = "";
      }
    });
  });
}

let workerCount = 1;

function addWorker() {
  workerCount++;

  const newWorker = document.createElement("div");
  newWorker.classList.add("worker");

  newWorker.innerHTML = `
        <div>
            <label for="legajo-${workerCount}">Legajo:</label>
            <input
                type="number"
                class="legajo"
                list="legajos-list"
                name="legajo-${workerCount}"
                id="legajo-${workerCount}"
                max="99999"
                min="1"
            />
        </div>
        <div>
            <label for="nombre-${workerCount}">Nombre:</label>
            <input type="text" name="nombre-${workerCount}" id="nombre-${workerCount}" />
        </div>
    `;

  const workersContainer = document.querySelector(".workers");
  workersContainer.insertBefore(newWorker, workersContainer.lastElementChild);

  // Añadir event listener al nuevo input de legajo
  initLegajoListeners();
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {
    fechaPlanificada: document.getElementById("fechaPlanificada").value,
    fechaRealizada: document.getElementById("fechaRealizada").value,
    unidadMantenimiento: document.getElementById("unidadMantenimiento").value,
    "traslado-desde": document.getElementById("traslado-desde").value,
    "traslado-hasta": document.getElementById("traslado-hasta").value,
    inicio: document.getElementById("inicio").value,
    final: document.getElementById("final").value,
    "tmp-asgn-tareas-1": document.getElementById("tmp-asgn-tareas-1").value,
    "tmp-asgn-traslado-1": document.getElementById("tmp-asgn-traslado-1").value,
    "tmp-ejct-tareas-1": document.getElementById("tmp-ejct-tareas-1").value,
    "tmp-ejct-traslado-1": document.getElementById("tmp-ejct-traslado-1").value,
    "TE - Tarea Eventual": document.getElementById("tarea-trabajo").value,
    observaciones: document.getElementById("observaciones").value,
    workers: [],
  };

  // Recolectar datos de los trabajadores dinámicamente agregados
  for (let i = 1; i <= workerCount; i++) {
    const legajo = document.getElementById(`legajo-${i}`).value;
    const nombre = document.getElementById(`nombre-${i}`).value;
    formData.workers.push({ legajo, nombre });
  }

  localStorage.setItem("formData", JSON.stringify(formData));

  window.location.href = "parte.html";
});
