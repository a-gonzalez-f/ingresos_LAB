document.addEventListener("DOMContentLoaded", function () {
  const hmb = document.querySelectorAll(".hmb");
  const lim = document.querySelector(".lim");
  const menu = document.querySelector(".menu");
  let limVisible = false;

  hmb.forEach(function (item) {
    item.addEventListener("click", function () {
      if (!limVisible) {
        lim.style.left = "0";
        limVisible = true;
      } else {
        lim.style.left = "-10vw";
        limVisible = false;
      }
    });
  });

  menu.addEventListener("mouseleave", function () {
    lim.style.left = "-10vw";
    limVisible = false;
  });
});
