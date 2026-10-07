/* Docs page behaviour: the mobile nav toggle, search, code language tabs, and "on this page" highlighting.
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

  // Search: a dialog opened from the sidebar, "/" or Ctrl+K. The index (search-index.json, written by
  // the build) is fetched the first time it opens. Every word of the query has to match an entry.
  var dialog = document.querySelector('.docs-search');
  var opener = document.querySelector('.docs-search-open');
  if (dialog && opener && !dialog.showModal) opener.hidden = true;
  if (dialog && opener && dialog.showModal) {
    var input = dialog.querySelector('input');
    var status = dialog.querySelector('.docs-search-status');
    var list = dialog.querySelector('.docs-search-results');
    var index = null;
    var loading = false;
    var active = -1;

    // 0: no match, 1: inside a word, 2: at the start of a word
    function hit(text, term) {
      var at = text.indexOf(term);
      if (at < 0) return 0;
      return at === 0 || /[^a-z0-9]/.test(text.charAt(at - 1)) ? 2 : 1;
    }

    function find(terms) {
      var found = [];
      index.forEach(function (entry, order) {
        var score = 0;
        var own = 0;
        for (var i = 0; i < terms.length; i++) {
          var inTitle = hit(entry.lowTitle, terms[i]);
          var inHeading = hit(entry.lowHeading, terms[i]);
          var inText = hit(entry.lowText, terms[i]);
          // A heading's entry can lean on the page title for some words, but not for all of them
          var mine = entry.heading ? inHeading * 6 + inText : inTitle * 10 + inText;
          if (!mine && !inTitle) return;
          own += mine;
          score += mine || 1;
        }
        if (own) found.push({ entry: entry, score: score, order: order });
      });
      found.sort(function (a, b) { return b.score - a.score || a.order - b.order; });
      return found.slice(0, 20).map(function (f) { return f.entry; });
    }

    function snippet(entry, terms) {
      var first = -1;
      terms.forEach(function (term) {
        var at = entry.lowText.indexOf(term);
        if (at >= 0 && (first < 0 || at < first)) first = at;
      });
      var start = Math.max(0, first - 40);
      if (start > 0) start = entry.text.indexOf(' ', start) + 1;
      var text = entry.text.slice(start, start + 140);
      return (start > 0 ? '…' : '') + text + (start + 140 < entry.text.length ? '…' : '');
    }

    function appendMarked(parent, text, terms) {
      var pattern = terms.map(function (term) { return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|');
      text.split(new RegExp('(' + pattern + ')', 'gi')).forEach(function (part, i) {
        if (!part) return;
        if (i % 2) {
          var mark = document.createElement('mark');
          mark.textContent = part;
          parent.appendChild(mark);
        } else {
          parent.appendChild(document.createTextNode(part));
        }
      });
    }

    function span(cls) {
      var el = document.createElement('span');
      el.className = cls;
      return el;
    }

    function setActive(i) {
      var links = list.querySelectorAll('a');
      if (!links.length) { active = -1; return; }
      active = (i + links.length) % links.length;
      Array.prototype.forEach.call(links, function (a, n) { a.classList.toggle('is-active', n === active); });
      links[active].scrollIntoView({ block: 'nearest' });
    }

    function render() {
      var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      list.textContent = '';
      active = -1;
      if (!terms.length) { status.textContent = ''; return; }
      if (!index) { status.textContent = loading ? 'Loading…' : 'Search could not be loaded.'; return; }
      var results = find(terms);
      status.textContent = results.length ? '' : 'No results for "' + input.value.trim() + '".';
      results.forEach(function (entry) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = entry.url;
        var name = span('docs-search-name');
        appendMarked(name, entry.heading || entry.title, terms);
        a.appendChild(name);
        if (entry.heading) {
          var page = span('docs-search-page');
          page.textContent = entry.title;
          a.appendChild(page);
        }
        if (entry.text) {
          var text = span('docs-search-text');
          appendMarked(text, snippet(entry, terms), terms);
          a.appendChild(text);
        }
        li.appendChild(a);
        list.appendChild(li);
      });
      setActive(0);
    }

    function load() {
      loading = true;
      fetch('/docs/search-index.json')
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.json();
        })
        .then(function (entries) {
          entries.forEach(function (entry) {
            entry.lowTitle = entry.title.toLowerCase();
            entry.lowHeading = entry.heading.toLowerCase();
            entry.lowText = entry.text.toLowerCase();
          });
          index = entries;
        })
        .catch(function () { /* render() reports it; opening the dialog again retries */ })
        .then(function () {
          loading = false;
          render();
        });
    }

    function openSearch() {
      if (dialog.open) return;
      dialog.showModal();
      input.select();
      if (!index && !loading) load();
      render();
    }

    opener.addEventListener('click', openSearch);
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        list.querySelectorAll('a')[active].click();
      }
    });
    // A result on the current page only scrolls, so the dialog has to close itself
    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) dialog.close();
    });
    // Clicks on the backdrop land on the dialog element itself
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      var slash = e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey;
      var ctrlK = (e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey;
      if (!slash && !ctrlK) return;
      e.preventDefault();
      openSearch();
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
