// Percurso: escolher que tipos de marco aparecem na linha do tempo (nenhum escolhido = tudo).
(function () {
  var grupo = document.getElementById("filtro-tipos");
  if (!grupo) return;
  var botoes = Array.prototype.slice.call(grupo.querySelectorAll("button"));
  var marcos = Array.prototype.slice.call(document.querySelectorAll(".linha-tempo .marco"));
  var escolhidos = {};
  function aplicar() {
    var algum = Object.keys(escolhidos).length > 0;
    botoes.forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.tipo ? String(!!escolhidos[b.dataset.tipo]) : String(!algum));
    });
    marcos.forEach(function (m) { m.classList.toggle("oculto", algum && !escolhidos[m.dataset.tipo]); });
  }
  botoes.forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.dataset.tipo;
      if (!t) escolhidos = {};
      else if (escolhidos[t]) delete escolhidos[t];
      else escolhidos[t] = true;
      aplicar();
    });
  });
  aplicar();
})();
