// Filtro de texto nas páginas das vertentes
(function () {
  var campo = document.getElementById("filtro");
  if (!campo) return;
  var norm = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var linhas = Array.prototype.slice.call(document.querySelectorAll(".itens li"));
  linhas.forEach(function (li) { li._t = norm(li.textContent); });
  campo.addEventListener("input", function () {
    var q = norm(campo.value.trim());
    linhas.forEach(function (li) { li.classList.toggle("oculto", q && li._t.indexOf(q) < 0); });
    document.querySelectorAll(".seccao").forEach(function (s) {
      s.classList.toggle("oculto", !!q && !s.querySelector(".itens li:not(.oculto)"));
    });
    document.querySelectorAll(".seccao h3").forEach(function (h) {
      var ol = h.nextElementSibling;
      h.classList.toggle("oculto", !!q && ol && !ol.querySelector("li:not(.oculto)"));
    });
  });
})();
