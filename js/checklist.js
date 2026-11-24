(function () {
  "use strict";
  var IC = window.IC;
  var boxes = document.querySelectorAll(".step-check input[type=checkbox]");
  var progress = document.getElementById("check-progress");
  var label = document.getElementById("check-label");
  var clear = document.getElementById("check-clear");
  if (!boxes.length || !progress) return;
  var KEY = "checklist-proteger";
  var saved = IC.storage.get(KEY, []);

  function render() {
    var done = 0;
    boxes.forEach(function (b) {
      if (b.checked) done++;
      var step = b.closest(".step");
      if (step) step.classList.toggle("done", b.checked);
    });
    progress.max = boxes.length;
    progress.value = done;
    label.textContent = done + " de " + boxes.length + " passos concluídos";
  }
  function save() {
    var ids = [];
    boxes.forEach(function (b) {
      if (b.checked) ids.push(b.getAttribute("data-step"));
    });
    IC.storage.set(KEY, ids);
  }
  boxes.forEach(function (b) {
    b.checked = saved.indexOf(b.getAttribute("data-step")) !== -1;
    b.addEventListener("change", function () {
      save();
      render();
    });
  });
  clear.addEventListener("click", function () {
    boxes.forEach(function (b) {
      b.checked = false;
    });
    save();
    render();
  });
  render();
})();
