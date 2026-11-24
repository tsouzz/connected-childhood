(function () {
  "use strict";
  var IC = window.IC;
  var section = document.getElementById("sim-cookies");
  if (!section) return;
  var dialog = document.getElementById("cookie-dialog");
  var openBtn = document.getElementById("open-cookies");
  var result = document.getElementById("cookie-result");
  var mode = "dark";
  var clicks = 0;
  var decided = false;
  var timer = null;
  var OPTIONS = [
    ["stats", "Estatísticas de uso"],
    ["personal", "Personalização de conteúdo"],
    ["ads", "Publicidade direcionada"],
  ];

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function optionList(checked) {
    return (
      '<fieldset class="cookie-options"><legend>Cookies opcionais</legend>' +
      OPTIONS.map(function (o) {
        return (
          '<label><input type="checkbox" name="' + o[0] + '"' + (checked ? " checked" : "") + " /> " + o[1] + "</label>"
        );
      }).join("") +
      "</fieldset>"
    );
  }
  function renderDark() {
    var left = 20;
    dialog.innerHTML =
      '<h3 id="cookie-title">Sua experiência, personalizada</h3>' +
      "<p>Usamos cookies para melhorar o site e mostrar ofertas para você. " +
      '<strong>A oferta de personalização expira em <span class="countdown" id="cookie-timer">0:20</span>.</strong></p>' +
      '<button type="button" class="button-primary cookie-big" data-act="accept">Aceitar tudo e continuar</button>' +
      '<button type="button" class="link-like" data-act="manage">Gerenciar preferências</button>';
    stopTimer();
    timer = window.setInterval(function () {
      left = Math.max(left - 1, 0);
      var el = document.getElementById("cookie-timer");
      if (el) el.textContent = "0:" + String(left).padStart(2, "0");
    }, 1000);
  }
  function renderManage() {
    stopTimer();
    dialog.innerHTML =
      '<h3 id="cookie-title">Preferências de cookies</h3>' +
      "<p>Desmarque cada opção que você não quer e salve.</p>" +
      optionList(true) +
      '<div class="cookie-actions"><button type="button" class="button-primary" data-act="save">Salvar preferências</button></div>';
  }
  function renderLaw() {
    stopTimer();
    dialog.innerHTML =
      '<h3 id="cookie-title">Cookies neste site</h3>' +
      "<p>Os cookies necessários sempre ficam ativos. Os opcionais começam desligados e a escolha é sua, em linguagem simples.</p>" +
      '<ul><li>Estatísticas de uso</li><li>Personalização de conteúdo</li><li>Publicidade direcionada</li></ul>' +
      '<div class="cookie-actions">' +
      '<button type="button" data-act="refuse">Recusar opcionais</button>' +
      '<button type="button" data-act="accept-opt">Aceitar opcionais</button></div>';
  }
  function finish(msg) {
    decided = true;
    result.textContent = msg;
    stopTimer();
    dialog.close();
  }

  dialog.addEventListener("click", function (e) {
    var t = e.target.closest("button, input");
    if (!t) return;
    clicks++;
    var act = t.getAttribute("data-act");
    if (act === "accept") {
      finish("Você aceitou tudo em " + IC.plural(clicks, "clique", "cliques") + ". Aceitar sempre foi o caminho curto.");
    } else if (act === "manage") {
      renderManage();
    } else if (act === "save") {
      var kept = dialog.querySelectorAll("input:checked").length;
      if (kept === 0) {
        finish("Você recusou os opcionais em " + IC.plural(clicks, "clique", "cliques") + ". Aceitar tudo levava 1.");
      } else {
        finish("Você manteve " + IC.plural(kept, "opção ativa", "opções ativas") + " depois de " + IC.plural(clicks, "clique", "cliques") + ".");
      }
    } else if (act === "refuse") {
      finish("Você recusou os opcionais em " + IC.plural(clicks, "clique", "cliques") + ". Recusar é tão fácil quanto aceitar.");
    } else if (act === "accept-opt") {
      finish("Você aceitou os opcionais em " + IC.plural(clicks, "clique", "cliques") + ", por escolha própria.");
    }
  });
  dialog.addEventListener("close", function () {
    stopTimer();
    if (!decided) result.textContent = "Banner fechado sem fazer uma escolha.";
    openBtn.focus();
  });
  openBtn.addEventListener("click", function () {
    clicks = 0;
    decided = false;
    result.textContent = "";
    dialog.setAttribute("aria-labelledby", "cookie-title");
    if (mode === "dark") renderDark();
    else renderLaw();
    dialog.showModal();
  });
  IC.bindMode(section, function (m) {
    mode = m;
    result.textContent = "";
  });
})();
