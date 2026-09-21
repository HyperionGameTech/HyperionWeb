/* Docs page behaviour: the mobile nav toggle and "on this page" highlighting.
   Everything else is rendered at build time by tools/build-docs.mjs. */
(function () {
  var sidebar = document.querySelector('.docs-sidebar');
  var toggle = document.querySelector('.docs-nav-toggle');
  if (sidebar && toggle) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.docs-toc a'));
  var headings = tocLinks.map(function (a) {
    return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
  });
  if (!tocLinks.length) return;

  var ticking = false;
  function spy() {
    ticking = false;
    var active = 0;
    headings.forEach(function (h, i) {
      if (h && h.getBoundingClientRect().top < 120) active = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = headings.length - 1;
    tocLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();
})();
