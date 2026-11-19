// Páginas por tema: começa com os destaques; qualquer filtro mostra todos os trabalhos que lhe correspondem.
(function () {
  var lista = document.getElementById("lista");
  if (!lista) return;
  var norm = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var linhas = Array.prototype.slice.call(lista.querySelectorAll(".itens li"));
  linhas.forEach(function (li) { li._t = norm(li.textContent); });
  var form = document.getElementById("filtros"), texto = document.getElementById("filtro"),
      ano = document.getElementById("f-ano"), formato = document.getElementById("f-formato"),
      botao = document.getElementById("alternar"), titulo = document.getElementById("titulo-lista"),
      vazio = document.getElementById("vazio");
  var todos = false;
  var opcoes = Array.prototype.slice.call(formato.options);
  function formatosDoTipo(tipo) {
    var atual = formato.value, manter = false;
    while (formato.options.length) formato.remove(0);
    opcoes.forEach(function (o) {
      if (!o.value || !tipo || o.dataset.tipo === tipo) {
        formato.add(o);
        if (o.value === atual) manter = true;
      }
    });
    formato.value = manter ? atual : "";
  }
  function aplicar() {
    var tipo = (form.querySelector('input[name="tipo"]:checked') || {}).value || "";
    formatosDoTipo(tipo);
    var q = norm(texto.value.trim()), a = ano.value, f = formato.value;
    var filtrado = !!(tipo || q || a || f);
    var mostrarTodos = todos || filtrado;
    var algum = false;
    linhas.forEach(function (li) {
      var ok = (mostrarTodos || li.classList.contains("destaque")) &&
        (!tipo || li.dataset.tipo === tipo) && (!a || li.dataset.ano === a) &&
        (!f || li.dataset.formato === f) && (!q || li._t.indexOf(q) >= 0);
      li.classList.toggle("oculto", !ok);
      if (ok) algum = true;
    });
    vazio.classList.toggle("oculto", algum);
    document.querySelectorAll(".descritor-dyn").forEach(function (d) {
      if (d.dataset.aplicada) d.textContent = (tipo === "projetos" || tipo === "cooperacao") ? d.dataset.aplicada : d.dataset.geral;
    });
    titulo.textContent = mostrarTodos ? titulo.dataset.todos : titulo.dataset.destaques;
    botao.textContent = mostrarTodos ? botao.dataset.destaques : botao.dataset.todos;
  }
  form.addEventListener("input", aplicar);
  form.addEventListener("change", aplicar);
  botao.addEventListener("click", function () {
    var filtrado = form.querySelector('input[name="tipo"]:checked').value || texto.value || ano.value || formato.value;
    if (todos || filtrado) { todos = false; form.reset(); } else { todos = true; }
    aplicar();
  });
  // ?tipo=orientacoes (ex.: vindo do endereço antigo do Ensino) escolhe logo esse tipo de conteúdo.
  var pedido = (location.search.match(/[?&]tipo=([a-z]+)/) || [])[1];
  var radio = pedido && form.querySelector('input[name="tipo"][value="' + pedido + '"]');
  if (radio) radio.checked = true;
  aplicar();
})();
