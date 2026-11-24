(function () {
  "use strict";
  var button = document.querySelector(".menu-button");
  var menu = document.getElementById("menu");
  if (!button || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", function () {
    setOpen(!menu.classList.contains("open"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      button.focus();
    }
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
})();
