(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Contagem animada dos números */
  function format(value, decimals, suffix) {
    return (
      value.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix
    );
  }
  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || isNaN(target)) {
      el.textContent = format(target, decimals, suffix);
      return;
    }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals, suffix);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) {
      io.observe(c);
    });
  } else {
    counters.forEach(animate);
  }

  /* Vídeo: se data-youtube-id estiver preenchido, troca o vídeo local pelo embed do YouTube */
  var player = document.getElementById("video-player");
  if (player) {
    var id = (player.getAttribute("data-youtube-id") || "").trim();
    if (id) {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id);
      iframe.title = player.getAttribute("data-title") || "Vídeo explicativo";
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      player.textContent = "";
      player.appendChild(iframe);
    }
  }
})();
