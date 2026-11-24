(function () {
  "use strict";
  var buttons = document.querySelectorAll(".filters button");
  var rows = document.querySelectorAll("tbody tr[data-category]");
  if (!buttons.length) return;
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var cat = b.getAttribute("data-category");
      buttons.forEach(function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      rows.forEach(function (r) {
        r.hidden = cat !== "all" && r.getAttribute("data-category") !== cat;
      });
    });
  });
})();
