document.addEventListener("DOMContentLoaded", function () {
  const mesSelect = document.getElementById("mesSelect");

  // Función para obtener y mostrar los datos
  function obtenerYMostrarDatos(selectedMonth) {
    fetch(`/mostrar-tea?mes=${selectedMonth}`)
      .then((response) => response.json())
      .then((teaData) => {
        // Normalizar los datos de telemandos para asegurar que comentarios sea siempre un arreglo
        teaData.forEach((tea) => {
          if (!Array.isArray(tea.comentarios)) {
            tea.comentarios = [];
          }
        });
        // Filtrar los objetos TEA según el mes seleccionado
        const filteredTea = teaData.filter((tea) => tea.mes === selectedMonth);

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
        // Normalizar los datos de telemandos para asegurar que comentarios sea siempre un arreglo
        telemandosData.forEach((telemando) => {
          if (!Array.isArray(telemando.comentarios)) {
            telemando.comentarios = [];
          }
        });

        // Filtrar los objetos Telemandos según el mes seleccionado
        const filteredTelemandos = telemandosData.filter(
          (telemando) => telemando.mes === selectedMonth
        );

        // Mostrar los objetos Telemandos en el div correspondiente
        mostrarTelemandos(filteredTelemandos);
        mostrarPropTelemandos(filteredTelemandos);
      })
      .catch((error) =>
        console.error("Error al obtener los datos de Telemandos:", error)
      );
  }

  // Obtener el mes actual y establecerlo como seleccionado por defecto
  const mesActual = new Date()
    .toLocaleString("es-ES", { month: "long" })
    .toUpperCase();
  const meses = Array.from(mesSelect.options).map((option) =>
    option.value.toUpperCase()
  );
  const mesIndex = meses.indexOf(mesActual);
  if (mesIndex !== -1) {
    mesSelect.selectedIndex = mesIndex;
    mesSelect.options[mesIndex].classList.add("mesActual");
  } else {
    console.error("El mes actual no se encontró en la lista de opciones.");
  }

  // Llamar a la función para obtener y mostrar los datos del mes seleccionado
  obtenerYMostrarDatos(mesSelect.value);

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
      teaCard.classList.add("card");
      teaCard.id = tea._id;

      // Añadir la clase "realizado" si el estado es "Realizado"
      if (tea.estado === "Realizado") {
        teaCard.classList.add("realizado");
      }

      // Crear y agregar el contenido estático del teaCard
      teaCard.innerHTML = `
        <div class="linea">
          <p class="circle ${tea.linea}"> ${tea.linea}</p>
        </div>
        <div class="info">
          <p class="unidad"> ${tea.unidad}</p>
          <p class="estado"> ${tea.estado}</p>
        </div>
      `;

      // Asegurarse de que tea.trabajador sea un array
      if (!Array.isArray(tea.trabajador)) {
        tea.trabajador = [];
      } else {
        // Eliminar duplicados
        tea.trabajador = Array.from(new Set(tea.trabajador));
      }

      // Crear el div para los trabajadores y agregar cada trabajador en su propio <p>
      const trabajadoresDiv = document.createElement("div");
      trabajadoresDiv.classList.add("divTrabajadores");
      tea.trabajador.forEach((trabajador) => {
        if (trabajador.trim() !== "") {
          const trabajadorP = document.createElement("p");
          trabajadorP.textContent = trabajador;
          trabajadoresDiv.appendChild(trabajadorP);
        }
      });

      // Crear el div para los comentarios y agregar cada comentario en su propio <p>
      const comentariosDiv = document.createElement("div");
      comentariosDiv.classList.add("divComentarios");
      tea.comentarios.forEach((comentario) => {
        if (comentario.trim() !== "") {
          const comentarioP = document.createElement("p");
          comentarioP.textContent = comentario;
          comentariosDiv.appendChild(comentarioP);
        }
      });

      // Agregar los divs de trabajadores y comentarios al teaCard
      teaCard.appendChild(trabajadoresDiv);
      teaCard.appendChild(comentariosDiv);

      // Agregar el teaCard al contenedor principal
      teaCardsDiv.appendChild(teaCard);
    });
  }

  function mostrarTelemandos(telemandosData) {
    const telemandosCardsDiv = document.getElementById("telemandosCards");
    telemandosCardsDiv.innerHTML = ""; // Limpiar contenido previo

    telemandosData.forEach((telemando) => {
      const telemandoCard = document.createElement("div");
      telemandoCard.innerHTML = `
        <div class="card" id="${telemando._id}">
            <div class="linea">
                <p class="circle ${telemando.linea}"> ${telemando.linea}</p>
            </div>
            <div>
                <p class="unidad"> ${telemando.unidad}</p>
                <p> ${telemando.sistema}</p>
                <p> ${telemando.estado}</p>
                <p> ${telemando.trabajador}</p>
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
      (tea) => tea.estado === "Realizado"
    ).length;

    const propTeaSpan = document.getElementById("propTea");
    propTeaSpan.textContent = `(${realizadosTeaCards}/${totalTeaCards})`;
  }

  function mostrarPropTelemandos(telemandosData) {
    const telemandosCardsDiv = document.getElementById("telemandosCards");
    const totalTelemandosCards = telemandosData.length;
    const realizadosTelemandosCards = telemandosData.filter(
      (telemando) => telemando.estado === "Realizado"
    ).length;

    const propTelemandosSpan = document.getElementById("propTlmnd");
    propTelemandosSpan.textContent = `(${realizadosTelemandosCards}/${totalTelemandosCards})`;
  }
});
