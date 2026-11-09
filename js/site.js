// Portfólio: tema claro/escuro, menu do celular, seção ativa no menu e entrada suave das seções.
(function () {
  var raiz = document.documentElement;

  // ---------------------------------------------------------------- tema
  // Sem escolha salva, segue o sistema. O botão grava a escolha (quando o navegador permite).
  var escuroNoSistema = window.matchMedia('(prefers-color-scheme: dark)');
  function temaAtual() {
    if (raiz.dataset.theme) return raiz.dataset.theme;
    return escuroNoSistema.matches ? 'dark' : 'light';
  }
  function atualizarCorDaBarra() {
    var cor = getComputedStyle(raiz).getPropertyValue('--fundo').trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', cor); });
  }
  document.getElementById('alternar-tema').addEventListener('click', function () {
    var novo = temaAtual() === 'dark' ? 'light' : 'dark';
    raiz.dataset.theme = novo;
    try { localStorage.setItem('tema', novo === 'dark' ? 'escuro' : 'claro'); } catch (e) {}
    atualizarCorDaBarra();
  });
  if (raiz.dataset.theme) atualizarCorDaBarra();

  // ---------------------------------------------------------------- menu do celular
  var menu = document.getElementById('menu');
  var abrir = document.getElementById('abrir-menu');
  function fecharMenu() { menu.classList.remove('aberto'); abrir.setAttribute('aria-expanded', 'false'); }
  abrir.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    abrir.setAttribute('aria-expanded', String(aberto));
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });

  // ---------------------------------------------------------------- borda do topo ao rolar
  var topo = document.querySelector('.topo');
  function aoRolar() { topo.classList.toggle('rolou', window.scrollY > 8); }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // ---------------------------------------------------------------- seção ativa e entrada suave
  if ('IntersectionObserver' in window) {
    var links = {};
    menu.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var observarSecao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting || !links[e.target.id]) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('ativo', id === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { observarSecao.observe(s); });

    var observarEntrada = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); observarEntrada.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.projeto, .competencia, .estudo, .principios li, .contato').forEach(function (el) {
      el.classList.add('revelar');
      observarEntrada.observe(el);
    });
  }

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
