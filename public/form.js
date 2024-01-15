// form.js

// fecha del día por defecto
var fechaIngresoInput = document.getElementById("fecha-ingreso");
var fechaActual = new Date();
var dia = fechaActual.getDate().toString().padStart(2, "0");
var mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
var año = fechaActual.getFullYear().toString().slice(2);
var fechaFormateada = `${dia}/${mes}/${año}`;
fechaIngresoInput.value = fechaFormateada;

// interno solo numero
function validarNumeros(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}
// envio formulario a la db
document
  .getElementById("ingreso-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const jsonData = {};
    formData.forEach((value, key) => {
      if (key === "fecha-ingreso") {
        jsonData[key] = new Date(value); // Convertir la cadena de fecha a objeto Date
      } else {
        jsonData[key] = value;
      }
    });

    const response = await fetch("http://localhost:3000/guardar-dato", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      alert("Dato guardado correctamente");
    } else {
      alert("Error al guardar el dato");
    }
  });
