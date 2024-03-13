document.addEventListener("DOMContentLoaded", function () {
  const hmb = document.querySelectorAll(".hmb");
  const lim = document.querySelector(".lim");
  const menu = document.querySelector(".menu");
  let limVisible = false;

  hmb.forEach(function (item) {
    item.addEventListener("click", function () {
      if (!limVisible) {
        lim.style.display = "block";
        limVisible = true;
      } else {
        lim.style.display = "none";
        limVisible = false;
      }
    });
  });

  menu.addEventListener("mouseleave", function () {
    lim.style.display = "none";
    limVisible = false;
  });
});
