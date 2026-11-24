(function () {
  "use strict";
  var IC = window.IC;
  var section = document.getElementById("sim-urgency");
  if (!section) return;
  var LIMIT = 20;
  var timerEl = document.getElementById("urg-timer");
  var resetsEl = document.getElementById("urg-resets");
  var buyBtn = document.getElementById("urg-buy");
  var msg = document.getElementById("urg-message");
  var left = LIMIT;
  var resets = 0;
  var interval = null;
  var mode = "dark";

  function fmt(sec) {
    return "0:" + String(sec).padStart(2, "0");
  }
  function render() {
    timerEl.textContent = fmt(left);
    resetsEl.textContent = resets;
  }
  function stop() {
    if (interval) window.clearInterval(interval);
    interval = null;
  }
  function tick() {
    left--;
    if (left < 0) {
      left = LIMIT;
      resets++;
    }
    render();
  }
  buyBtn.addEventListener("click", function () {
    if (mode === "dark") {
      msg.textContent = "Compra simulada com " + fmt(left) + " no relógio. O cronômetro sempre recomeça: a pressa foi fabricada. Nada foi cobrado.";
    } else {
      msg.textContent = "Compra simulada, sem pressa e sem prazo artificial. Nada foi cobrado.";
    }
  });
  IC.bindMode(section, function (m) {
    mode = m;
    stop();
    left = LIMIT;
    resets = 0;
    msg.textContent = "";
    render();
    if (mode === "dark") interval = window.setInterval(tick, 1000);
  });
})();
