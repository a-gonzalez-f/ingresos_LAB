document.addEventListener("DOMContentLoaded", function () {
  const hmb = document.querySelectorAll(".hmb");
  const lim = document.querySelector(".lim");
  const menu = document.querySelector(".menu");
  let limVisible = false;
  let mouseLeaveTimer;

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
});
