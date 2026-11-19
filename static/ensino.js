// Páginas do Ensino: filtros simples sobre atributos data-* das fichas (sem contadores).
(function () {
  var form = document.getElementById("filtros"), lista = document.getElementById("lista");
  if (!form || !lista) return;
  var vazio = document.getElementById("vazio");
  var norm = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var fichas = Array.prototype.slice.call(lista.querySelectorAll(".ficha"));
  fichas.forEach(function (f) { f._t = norm(f.textContent); });
  function valor(nome) {
    var el = form.elements[nome];
    if (!el) return "";
    if (el.length !== undefined && !el.tagName) {   // grupo de botões de opção
      var c = form.querySelector('input[name="' + nome + '"]:checked');
      return c ? c.value : "";
    }
    return el.value || "";
  }
  function aplicar() {
    var q = norm(valor("q").trim()), estado = valor("estado"), nivel = valor("nivel"),
        area = valor("area"), tema = valor("tema"), ano = valor("ano");
    var algum = false;
    fichas.forEach(function (f) {
      var ok = (!area || f.dataset.area === area) && (!tema || f.dataset.tema === tema) &&
               (!ano || f.dataset.ano === ano) && (!q || f._t.indexOf(q) >= 0);
      var occ = f.querySelectorAll(".ocorrencias > li");
      if (occ.length) {
        // Unidades curriculares: o estado e o nível filtram cada ocorrência (curso e período).
        var visiveis = 0;
        Array.prototype.forEach.call(occ, function (o) {
          var v = ok && (!estado || o.dataset.estado === estado) && (!nivel || o.dataset.nivel === nivel);
          o.classList.toggle("oculto", !v);
          if (v) visiveis++;
        });
        ok = visiveis > 0;
      } else {
        ok = ok && (!estado || f.dataset.estado === estado) && (!nivel || f.dataset.nivel === nivel);
      }
      f.classList.toggle("oculto", !ok);
      if (ok) algum = true;
    });
    Array.prototype.forEach.call(lista.querySelectorAll("section.area"), function (s) {
      s.classList.toggle("oculto", !s.querySelector(".ficha:not(.oculto)"));
    });
    vazio.classList.toggle("oculto", algum);
  }
  form.addEventListener("input", aplicar);
  form.addEventListener("change", aplicar);
  aplicar();
})();
