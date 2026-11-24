(function () {
  "use strict";

  /* ============================================================
     CONFIGURAÇÃO DO FEED
     Navegadores não listam pastas, então os vídeos são declarados aqui.
     Para adicionar ou renomear vídeos: coloque o arquivo em
     assets/videos/feed/ e ajuste o caminho na lista abaixo.
     Se um arquivo não existir, aquele item mostra um aviso discreto.
     Formato recomendado: .mp4 (H.264), vertical 9:16, curto e leve.
     ============================================================ */
  var FEED_VIDEOS = [
    "assets/video/feed/video-feed-1.mp4",
    "assets/video/feed/video-feed-2.mp4",
    "assets/video/feed/video-feed-3.mp4",
    "assets/video/feed/video-feed-4.mp4",
  ];
  /* Quantos itens entram por lote (no modo dark pattern a lista é reciclada
     em ciclo; no modo da lei, o lote inicial é limitado ao total de vídeos). */
  var BATCH_SIZE = 4;
  /* ============================================================ */

  var section = document.getElementById("sim-feed");
  if (!section || !window.IC) return;
  var feed = document.getElementById("feed");
  var msg = document.getElementById("feed-message");
  var timeEl = document.getElementById("feed-time");
  var seenEl = document.getElementById("feed-seen");
  var nextBtn = document.getElementById("feed-next");
  var restartBtn = document.getElementById("feed-restart");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var mode = "dark";
  var total = 0;
  var seen = {};
  var seenCount = 0;
  var elapsed = 0;
  var itemIO = null;
  var sentinelIO = null;
  var tail = null;

  function lawBatch() {
    return Math.min(BATCH_SIZE, FEED_VIDEOS.length);
  }
  function scrollToItem(item) {
    if (item) feed.scrollTo({ top: item.offsetTop, behavior: reduce ? "auto" : "smooth" });
  }
  function update() {
    seenEl.textContent = seenCount;
    var m = Math.floor(elapsed / 60);
    var s = elapsed % 60;
    timeEl.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function markMissing(item, video, src) {
    item.setAttribute("data-missing", "1");
    if (video.parentNode) video.parentNode.removeChild(video);
    var cap = item.querySelector(".feed-caption");
    if (cap) cap.hidden = true;
    var box = document.createElement("div");
    box.className = "feed-missing";
    var p = document.createElement("span");
    p.textContent = "Vídeo ainda não adicionado";
    var code = document.createElement("code");
    code.textContent = src;
    box.appendChild(p);
    box.appendChild(code);
    item.appendChild(box);
  }

  function createItem() {
    var index = total;
    var src = FEED_VIDEOS[index % FEED_VIDEOS.length];
    total++;
    var item = document.createElement("article");
    item.className = "feed-item";
    item.setAttribute("data-index", String(index));

    var video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "metadata");
    video.setAttribute("aria-label", "Vídeo " + (index + 1));
    /* No modo da lei, ou com movimento reduzido, o usuário controla a reprodução. */
    video.controls = mode === "law" || reduce;
    video.addEventListener("error", function () {
      markMissing(item, video, src);
    });
    video.src = src;
    item.appendChild(video);

    var cap = document.createElement("div");
    cap.className = "feed-caption";
    cap.textContent = "Vídeo " + (index + 1);
    item.appendChild(cap);

    feed.insertBefore(item, tail);
    itemIO.observe(item);
  }

  function appendBatch(n) {
    for (var i = 0; i < n; i++) createItem();
    /* reavalia a sentinela: se ainda estiver perto, carrega outro lote */
    if (mode === "dark" && sentinelIO && tail) {
      sentinelIO.unobserve(tail);
      sentinelIO.observe(tail);
    }
  }

  function createEndCard() {
    var end = document.createElement("article");
    end.className = "feed-item feed-end";
    var h = document.createElement("h4");
    h.textContent = "Hora de uma pausa";
    var p = document.createElement("p");
    p.textContent =
      "Você viu todas as novidades por agora. O ECA Digital prevê o combate a mecanismos que estimulem o uso compulsivo.";
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "Carregar mais vídeos (opcional)";
    b.addEventListener("click", function () {
      var before = feed.querySelectorAll(".feed-item:not(.feed-end)").length;
      appendBatch(lawBatch());
      var items = feed.querySelectorAll(".feed-item:not(.feed-end)");
      msg.textContent = "Você escolheu carregar mais. A decisão foi sua, não do feed.";
      scrollToItem(items[before]);
    });
    end.appendChild(h);
    end.appendChild(p);
    end.appendChild(b);
    return end;
  }

  function onItemVisibility(entries) {
    entries.forEach(function (e) {
      var item = e.target;
      var video = item.querySelector("video");
      if (e.isIntersecting) {
        var idx = item.getAttribute("data-index");
        if (idx !== null && !item.getAttribute("data-missing") && !seen[idx]) {
          seen[idx] = true;
          seenCount++;
          update();
        }
        if (video && !reduce) {
          var pr = video.play();
          if (pr && pr.catch) pr.catch(function () {});
        }
      } else if (video) {
        video.pause();
      }
    });
  }

  function build() {
    if (itemIO) itemIO.disconnect();
    if (sentinelIO) sentinelIO.disconnect();
    sentinelIO = null;
    feed.textContent = "";
    total = 0;
    seen = {};
    seenCount = 0;
    elapsed = 0;
    tail = null;
    feed.scrollTop = 0;

    if (!FEED_VIDEOS.length) {
      msg.textContent = "Adicione caminhos de vídeo na lista FEED_VIDEOS em js/lab/infinite-feed.js.";
      update();
      return;
    }
    itemIO = new IntersectionObserver(onItemVisibility, { root: feed, threshold: 0.6 });

    if (mode === "dark") {
      /* Rolagem infinita: a sentinela fica no fim; ao chegar perto, entra outro lote. */
      tail = document.createElement("div");
      tail.className = "feed-sentinel";
      tail.setAttribute("aria-hidden", "true");
      feed.appendChild(tail);
      sentinelIO = new IntersectionObserver(
        function (entries) {
          if (mode === "dark" && entries.some(function (x) { return x.isIntersecting; })) {
            appendBatch(BATCH_SIZE);
          }
        },
        { root: feed, rootMargin: "0px 0px 100% 0px" }
      );
      appendBatch(BATCH_SIZE);
      msg.textContent = "A lista nunca acaba: novos vídeos carregam sozinhos enquanto você rola.";
    } else {
      tail = createEndCard();
      feed.appendChild(tail);
      itemIO.observe(tail);
      appendBatch(lawBatch());
      msg.textContent = "Lista finita: ao fim do lote, o feed oferece uma pausa e deixa a escolha com você.";
    }
    update();
  }

  nextBtn.addEventListener("click", function () {
    var items = feed.querySelectorAll(".feed-item");
    var h = feed.clientHeight || 1;
    var current = Math.round(feed.scrollTop / h);
    scrollToItem(items[current + 1]);
  });
  restartBtn.addEventListener("click", build);
  window.setInterval(function () {
    elapsed++;
    update();
  }, 1000);

  window.IC.bindMode(section, function (m) {
    mode = m;
    build();
  });
})();
