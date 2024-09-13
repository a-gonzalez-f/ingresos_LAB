function actualizarSwitches() {
  const linea = document.getElementById("lineaTT").value;
  const modeloRadio = document.getElementById("modeloRadio").value;
  const modeloTT = document.getElementById("modeloTT");
  const cabinaTT = document.getElementById("cabinaTT");
  const lineaSwitches = document.querySelectorAll(".switch");
  const cabinaSwitch = document.querySelector(".cabina");
  const mtp = document.querySelectorAll(".mtp");
  const tt = document.querySelectorAll(".tt");

  const sectorDiv = document.querySelector(".sector");

  const opcionesModelo = {
    A: ["CNR", "N/A"],
    B: ["Mitsubishi Eidan", "CAF 6000", "N/A"],
    C: ["CNR", "Nagoya 5000", "N/A"],
    D: ["Alstom Serie 100", "Alstom Serie 300", "N/A"],
    E: ["Alstom Serie 100", "Fiat Materfer", "N/A"],
    H: ["Alstom Serie 300", "N/A"],
    P: ["Fiat Materfer", "N/A"],
  };

  const opcionesCabina = {
    CNR: ["RCA", "RC"],
    "CAF 6000": ["6", "1"],
    "Mitsubishi Eidan": ["6", "1"],
    "Nagoya 5000": ["Constitución", "Retiro"],
    "Alstom Serie 100": ["RCB", "RCA"],
    "Alstom Serie 300": ["RCB", "RCA"],
    "Fiat Materfer": ["C1", "C2"],
    "N/A": ["N/A"],
  };

  if (
    linea === "N/A" ||
    modeloRadio === "MTP850" ||
    modeloRadio === "MTP3250"
  ) {
    lineaSwitches.forEach((switchElement) => {
      switchElement.style.display = "none";
    });
    cabinaSwitch.style.display = "none";
  } else {
    lineaSwitches.forEach((switchElement) => {
      switchElement.style.display = "block";
    });

    modeloTT.innerHTML = "";
    cabinaTT.innerHTML = "";
    cabinaSwitch.style.display = "none";

    if (opcionesModelo[linea]) {
      opcionesModelo[linea].forEach(function (opcion) {
        const optionElement = document.createElement("option");
        optionElement.value = opcion;
        optionElement.textContent = opcion;
        modeloTT.appendChild(optionElement);
      });

      modeloTT.value = opcionesModelo[linea][0];
      actualizarCabina(opcionesModelo[linea][0]);
    }

    modeloTT.addEventListener("change", function () {
      const modelo = this.value;
      actualizarCabina(modelo);
    });
  }

  if (modeloTT.value !== "N/A") {
    sectorDiv.style.display = "none";
  }

  if (modeloRadio === "MTP850" || modeloRadio === "MTP3250") {
    mtp.forEach((switchElement) => {
      switchElement.classList.add("visible");
      switchElement.classList.remove("hidden");
    });
    tt.forEach((switchElement) => {
      switchElement.classList.add("hidden");
      switchElement.classList.remove("visible");
    });
  } else {
    mtp.forEach((switchElement) => {
      switchElement.classList.add("hidden");
      switchElement.classList.remove("visible");
    });
    tt.forEach((switchElement) => {
      switchElement.classList.add("visible");
      switchElement.classList.remove("hidden");
    });
  }

  function actualizarCabina(modelo) {
    cabinaTT.innerHTML = "";

    if (modelo === "N/A") {
      cabinaSwitch.style.display = "none";
      return;
    }

    if (opcionesCabina[modelo]) {
      cabinaSwitch.style.display = "block";
      opcionesCabina[modelo].forEach(function (opcion) {
        const optionElement = document.createElement("option");
        optionElement.value = opcion;
        optionElement.textContent = opcion;
        cabinaTT.appendChild(optionElement);
      });
    } else {
      cabinaSwitch.style.display = "none";
    }
  }
}

modeloTT.addEventListener("change", () => {
  const formacionDiv = document.querySelector(".formacion");
  const sectorDiv = document.querySelector(".sector");

  if (modeloTT.value === "N/A") {
    formacionDiv.style.display = "none";
    sectorDiv.style.display = "block";
  } else {
    formacionDiv.style.display = "block";
    sectorDiv.style.display = "none";
  }
});

document
  .getElementById("lineaTT")
  .addEventListener("change", actualizarSwitches);
document
  .getElementById("modeloRadio")
  .addEventListener("change", actualizarSwitches);

document
  .getElementById("ingreso-TT")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    const comment = document.getElementById("commentTT-1").value;
    if (comment) {
      jsonData.comentarios = [comment];
    }

    const modeloRadio = document.getElementById("modeloRadio").value;
    const linea = document.getElementById("lineaTT").value;
    const modeloTren = document.getElementById("modeloTT").value;

    if (modeloRadio === "MTP850" || modeloRadio === "MTP3250") {
      delete jsonData["modeloTT"];
      delete jsonData["formacionTT"];
      delete jsonData["cabinaTT"];
      delete jsonData["microfonoTT"];
      delete jsonData["parlanteTT"];
      delete jsonData["fuenteTT"];
      delete jsonData["antenaTT"];
    }

    if (modeloRadio === "MTM5400" || modeloRadio === "MTM800e") {
      delete jsonData["bateriaTT"];
      delete jsonData["pttTT"];
    }

    if (linea === "N/A") {
      delete jsonData["modeloTT"];
      delete jsonData["formacionTT"];
      delete jsonData["cabinaTT"];
    }

    if (linea !== "N/A" && modeloTren !== "N/A") {
      delete jsonData["sectorTT"];
    }

    const SERVER_URL = "http://172.26.211.60:3000";
    const response = await fetch(`${SERVER_URL}/guardar-radio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      alert("Error al guardar la radio");
      return;
    }

    alert("Se ha guardado la radio correctamente");

    window.location.reload();
  });
