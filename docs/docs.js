/* Docs page behaviour: the mobile nav toggle, code language tabs, and "on this page" highlighting.
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

  // Code tabs: picking a language switches every tab set on the page, and is remembered between pages
  var LANG_KEY = 'hyperion-docs-lang';
  var tabSets = Array.prototype.slice.call(document.querySelectorAll('.docs-tabs'));

  function selectLang(lang) {
    tabSets.forEach(function (set) {
      var tabs = Array.prototype.slice.call(set.querySelectorAll('[role="tab"]'));
      if (!tabs.some(function (tab) { return tab.getAttribute('data-lang') === lang; })) return;
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-lang') === lang;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });
      set.querySelectorAll('.docs-tabs-panel').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-lang') === lang);
      });
    });
  }

  function chooseLang(tab) {
    var lang = tab.getAttribute('data-lang');
    var before = tab.getBoundingClientRect().top;
    selectLang(lang);
    // Switching can change the height of tab sets further up; keep the clicked one where it was
    window.scrollBy(0, tab.getBoundingClientRect().top - before);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  tabSets.forEach(function (set) {
    var tabs = Array.prototype.slice.call(set.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { chooseLang(tab); });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var next = tabs[(i + step + tabs.length) % tabs.length];
        next.focus();
        chooseLang(next);
      });
    });
  });

  if (tabSets.length) {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* storage unavailable */ }
    if (saved) selectLang(saved);
  }

  // "On this page" highlighting
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
