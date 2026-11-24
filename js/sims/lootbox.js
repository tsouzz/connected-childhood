(function () {
  "use strict";
  var IC = window.IC;
  var section = document.getElementById("sim-lootbox");
  if (!section) return;
  var COST = 10;
  var START = 100;
  var openBtn = document.getElementById("open-box");
  var resetBtn = document.getElementById("lb-reset");
  var lawNote = document.getElementById("lb-ethical");
  var out = document.getElementById("lb-result");
  var el = {
    coins: document.getElementById("lb-coins"),
    spent: document.getElementById("lb-spent"),
    opens: document.getElementById("lb-opens"),
    legendary: document.getElementById("lb-legendary"),
    since: document.getElementById("lb-since"),
  };
  var PRIZES = {
    common: ["Adesivo comum", "Moeda de bronze", "Capa simples"],
    rare: ["Skin rara", "Efeito brilhante"],
    legendary: ["Skin LENDÁRIA", "Dragão lendário"],
  };
  var LABEL = { common: "Comum", rare: "Raro", legendary: "Lendário" };
  var mode = "dark";
  var s;

  function fresh() {
    return { coins: START, spent: 0, opens: 0, legendary: 0, since: 0, history: [] };
  }
  function roll() {
    var r = Math.random();
    var tier = r < 0.05 ? "legendary" : r < 0.3 ? "rare" : "common";
    var list = PRIZES[tier];
    return { tier: tier, name: list[Math.floor(Math.random() * list.length)] };
  }
  function render() {
    el.coins.textContent = s.coins;
    el.spent.textContent = s.spent;
    el.opens.textContent = s.opens;
    el.legendary.textContent = s.legendary;
    el.since.textContent = s.since;
    lawNote.hidden = mode !== "law";
    openBtn.disabled = mode === "law" || s.coins < COST;
    out.textContent = "";
    s.history.slice(-8).forEach(function (p) {
      var span = document.createElement("span");
      span.className = "prize " + (p.tier === "common" ? "" : p.tier);
      span.textContent = LABEL[p.tier] + ": " + p.name;
      out.appendChild(span);
    });
    if (mode === "dark" && s.coins < COST) {
      var p = document.createElement("p");
      p.textContent = "Moedas acabaram. Num jogo real, aqui apareceria o botão de comprar mais.";
      out.appendChild(p);
    }
  }

  openBtn.addEventListener("click", function () {
    if (mode !== "dark" || s.coins < COST) return;
    var prize = roll();
    s.coins -= COST;
    s.spent += COST;
    s.opens++;
    s.since++;
    if (prize.tier === "legendary") {
      s.legendary++;
      s.since = 0;
    }
    s.history.push(prize);
    render();
  });
  resetBtn.addEventListener("click", function () {
    s = fresh();
    render();
  });
  s = fresh();
  IC.bindMode(section, function (m) {
    mode = m;
    render();
  });
})();
