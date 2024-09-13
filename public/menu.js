document.addEventListener("DOMContentLoaded", function () {
  const hmb = document.querySelectorAll(".hmb");
  const lim = document.querySelector(".lim");
  const menu = document.querySelector(".menu");
  let limVisible = false;
  let mouseLeaveTimer;

  const equipos = document.getElementById("equipos");
  const radios = document.getElementById("radios");
  const lequipos = document.querySelector("#equipos .equipos");
  const lradios = document.querySelector("#radios .radios");

  hmb.forEach(function (item) {
    item.addEventListener("click", function () {
      if (!limVisible) {
        lim.style.left = "0";
        limVisible = true;
      } else {
        lim.style.left = "-170px";
        limVisible = false;
      }
    });
  });

  menu.addEventListener("mouseleave", function () {
    clearTimeout(mouseLeaveTimer);

    mouseLeaveTimer = setTimeout(function () {
      lim.style.left = "-170px";
      limVisible = false;
    }, 200);
  });

  menu.addEventListener("mouseenter", function () {
    clearTimeout(mouseLeaveTimer);
  });

  if (equipos && lequipos) {
    equipos.addEventListener("click", function () {
      lequipos.classList.toggle("show");
      equipos.classList.toggle("active");
    });
  }

  if (radios && lradios) {
    radios.addEventListener("click", function () {
      lradios.classList.toggle("show");
      radios.classList.toggle("active");
    });
  }
});
