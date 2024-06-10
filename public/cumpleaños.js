document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("/workers.json").then((response) => response.json()),
    fetch("/supervisores.json").then((response) => response.json()),
  ]).then(([workers, supervisores]) => {
    const personas = [...workers, ...supervisores];
    personas.forEach((persona) => {
      if (persona.nacimiento) {
        persona.cumple = persona.nacimiento;
      }
    });
    const cumpleañosOrdenados = obtenerCumpleañosOrdenados(personas);
    let indiceActual = 0;
    mostrarCumpleaños(cumpleañosOrdenados[indiceActual]);

    document.getElementById("siguiente").addEventListener("click", () => {
      indiceActual = (indiceActual + 1) % cumpleañosOrdenados.length;
      mostrarCumpleaños(cumpleañosOrdenados[indiceActual]);
    });
  });
});

function obtenerCumpleañosOrdenados(personas) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return personas
    .filter((persona) => persona.cumple)
    .map((persona) => {
      const [dia, mes] = persona.cumple.split("/").map(Number);
      let cumpleañosEsteAño = new Date(hoy.getFullYear(), mes - 1, dia);
      cumpleañosEsteAño.setHours(0, 0, 0, 0);

      // Si el cumpleaños ya pasó este año, considerar el próximo año
      if (cumpleañosEsteAño < hoy) {
        cumpleañosEsteAño.setFullYear(hoy.getFullYear() + 1);
      }

      return { ...persona, proximoCumple: cumpleañosEsteAño };
    })
    .sort((a, b) => a.proximoCumple - b.proximoCumple);
}

function mostrarCumpleaños(persona) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const card = document.querySelector(".card.cumpleaños");
  const [dia, mes] = persona.cumple.split("/").map(Number);
  const cumpleañosHoy = new Date(hoy.getFullYear(), mes - 1, dia);
  cumpleañosHoy.setHours(0, 0, 0, 0);

  document.getElementById("cumple").innerText = `${persona.nombre}`;
  document.getElementById("fecha").innerText = `${persona.cumple}`;

  if (cumpleañosHoy.getTime() === hoy.getTime()) {
    card.classList.add("hoy");
  } else {
    card.classList.remove("hoy");
  }
}
