document.addEventListener("DOMContentLoaded", function () {
  const mesSelect = document.getElementById("mesSelect");

  // Función para obtener y mostrar los datos
  function obtenerYMostrarDatos(selectedMonth) {
    fetch(`/mostrar-tea?mes=${selectedMonth}`)
      .then((response) => response.json())
      .then((teaData) => {
        // Filtrar los objetos TEA según el mes seleccionado
        const filteredTea = teaData.filter((tea) => tea.MES === selectedMonth);

        // Mostrar los objetos TEA en el div correspondiente
        mostrarTea(filteredTea);
        mostrarPropTea(filteredTea);
      })
      .catch((error) =>
        console.error("Error al obtener los datos de TEA:", error)
      );

    fetch(`/mostrar-telemandos?mes=${selectedMonth}`)
      .then((response) => response.json())
      .then((telemandosData) => {
        // Filtrar los objetos Telemandos según el mes seleccionado
        const filteredTelemandos = telemandosData.filter(
          (telemando) => telemando.MES === selectedMonth
        );

        // Mostrar los objetos Telemandos en el div correspondiente
        mostrarTelemandos(filteredTelemandos);
        mostrarPropTelemandos(filteredTelemandos);
      })
      .catch((error) =>
        console.error("Error al obtener los datos de Telemandos:", error)
      );
  }

  // Llamar a la función al cargar la página con el mes actual
  const mesActual = new Date()
    .toLocaleString("es-ES", { month: "long" })
    .toUpperCase();
  obtenerYMostrarDatos(mesActual);

  // Evento change para el select
  mesSelect.addEventListener("change", function () {
    const selectedMonth = mesSelect.value;
    obtenerYMostrarDatos(selectedMonth);
  });

  function mostrarTea(teaData) {
    const teaCardsDiv = document.getElementById("teaCards");
    teaCardsDiv.innerHTML = ""; // Limpiar contenido previo

    teaData.forEach((tea) => {
      const teaCard = document.createElement("div");
      teaCard.innerHTML = `
        <div class="card">
            <div class="linea">
                <p class="circle ${tea.LINEA}"> ${tea.LINEA}</p>
            </div>
            <div>
                <p class="unidad"> ${tea.UNIDAD}</p>
                <p> ${tea.ESTADO}</p>
                <p> ${tea.TRABAJADORES.join(", ")}</p>
                <p> ${tea.COMENTARIOS.join(", ")}</p>
            </div>
        </div>
      `;
      teaCardsDiv.appendChild(teaCard);
    });
  }

  function mostrarTelemandos(telemandosData) {
    const telemandosCardsDiv = document.getElementById("telemandosCards");
    telemandosCardsDiv.innerHTML = ""; // Limpiar contenido previo

    telemandosData.forEach((telemando) => {
      const telemandoCard = document.createElement("div");
      telemandoCard.innerHTML = `
        <div class="card">
            <div class="linea">
                <p class="circle ${telemando.LINEA}"> ${telemando.LINEA}</p>
            </div>
            <div>
                <p class="unidad"> ${telemando.UNIDAD}</p>
                <p> ${telemando.SISTEMA}</p>
                <p> ${telemando.ESTADO}</p>
                <p> ${telemando.TRABAJADORES}</p>
                <p> ${telemando.COMENTARIOS.join(", ")}</p>
            </div>
        </div>
      `;
      telemandosCardsDiv.appendChild(telemandoCard);
    });
  }

  function mostrarPropTea(teaData) {
    const teaCardsDiv = document.getElementById("teaCards");
    const totalTeaCards = teaData.length;
    const realizadosTeaCards = teaData.filter(
      (tea) => tea.ESTADO === "Realizado"
    ).length;

    const propTeaSpan = document.getElementById("propTea");
    propTeaSpan.textContent = `(${realizadosTeaCards}/${totalTeaCards})`;
  }

  function mostrarPropTelemandos(telemandosData) {
    const telemandosCardsDiv = document.getElementById("telemandosCards");
    const totalTelemandosCards = telemandosData.length;
    const realizadosTelemandosCards = telemandosData.filter(
      (telemando) => telemando.ESTADO === "Realizado"
    ).length;

    const propTelemandosSpan = document.getElementById("propTlmnd");
    propTelemandosSpan.textContent = `(${realizadosTelemandosCards}/${totalTelemandosCards})`;
  }
});
