(function () {
  "use strict";
  var IC = (window.IC = window.IC || {});
  /* Cada simulação tem o seu próprio seletor de modo:
     "dark" = Simular Dark Pattern, "law" = Ver como a Lei exige. */
  IC.bindMode = function (section, onChange) {
    var buttons = section.querySelectorAll(".segmented button");
    function set(mode) {
      section.setAttribute("data-mode", mode);
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode));
      });
      if (onChange) onChange(mode);
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        set(b.getAttribute("data-mode"));
      });
    });
    set(section.getAttribute("data-mode") || "dark");
    return set;
  };
  IC.plural = function (n, one, many) {
    return n + " " + (n === 1 ? one : many);
  };
})();
