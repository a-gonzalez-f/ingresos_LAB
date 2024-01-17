// form.js

//FECHA
// Establecer la fecha actual por defecto
const today = new Date().toISOString().split("T")[0];
document.getElementById("fechaIngreso").value = today;

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
      jsonData[key] = value;
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
