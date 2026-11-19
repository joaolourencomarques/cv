(function () {
  var mapa = document.getElementById('mapa');
  if (!mapa) return;
  var rede = document.getElementById('rede');
  var svg = document.getElementById('linhas');
  var NS = 'http://www.w3.org/2000/svg';
  var ligacoes = mapa.getAttribute('data-ligacoes').split(',').filter(Boolean).map(function (s) {
    var p = s.split(' '); return { t: 't-' + p[0], a: 'a-' + p[1] };
  });
  var nos = Array.prototype.slice.call(mapa.querySelectorAll('.no'));
  var atual = null;

  function vizinhos(id) {
    var v = {}; v[id] = true;
    ligacoes.forEach(function (l) {
      if (l.t === id) v[l.a] = true;
      if (l.a === id) v[l.t] = true;
    });
    return v;
  }

  function desenhar() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (getComputedStyle(svg).display === 'none') return;
    var r = rede.getBoundingClientRect();
    svg.setAttribute('width', r.width); svg.setAttribute('height', r.height);
    svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
    ligacoes.forEach(function (l) {
      var a = document.querySelector('#' + l.t + ' .ponto').getBoundingClientRect();
      var b = document.querySelector('#' + l.a + ' .ponto').getBoundingClientRect();
      var x1 = a.left + a.width / 2 - r.left, y1 = a.top + a.height / 2 - r.top;
      var x2 = b.left + b.width / 2 - r.left, y2 = b.top + b.height / 2 - r.top;
      var dx = (x2 - x1) / 2;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2);
      p.setAttribute('class', 'lig' + (atual ? ((l.t === atual || l.a === atual) ? ' acesa' : ' apagada') : ''));
      svg.appendChild(p);
    });
  }

  function escolher(id, rolar) {
    atual = (id === atual) ? null : id;
    var v = atual ? vizinhos(atual) : null;
    nos.forEach(function (n) {
      var nid = n.getAttribute('data-no');
      n.setAttribute('aria-pressed', nid === atual ? 'true' : 'false');
      n.classList.toggle('ligado', !!(v && v[nid] && nid !== atual));
      n.classList.toggle('apagado', !!(v && !v[nid]));
    });
    mapa.querySelectorAll('.mapa-painel').forEach(function (p) {
      p.classList.toggle('oculto', p.id !== 'p-' + atual);
    });
    document.getElementById('dica').classList.toggle('oculto', !!atual);
    desenhar();
    if (atual && rolar) {
      var p = document.getElementById('p-' + atual);
      var topo = p.getBoundingClientRect().top;
      if (topo > window.innerHeight * 0.85) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    try { history.replaceState(null, '', atual ? '#' + atual : location.pathname + location.search); } catch (e) {}
  }

  nos.forEach(function (n) {
    n.addEventListener('click', function () { escolher(n.getAttribute('data-no'), true); });
  });
  mapa.querySelectorAll('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-ir');
      atual = null; escolher(id, false);
      document.getElementById(id).focus({ preventScroll: true });
    });
  });
  var tempo;
  window.addEventListener('resize', function () { clearTimeout(tempo); tempo = setTimeout(desenhar, 80); });
  var inicial = location.hash.slice(1);
  if (inicial && document.querySelector('[data-no="' + inicial + '"]')) escolher(inicial, false);
  else desenhar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhar);
})();
