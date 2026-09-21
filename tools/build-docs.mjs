import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import MarkdownIt from 'markdown-it';
import deflist from 'markdown-it-deflist';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'docs-src');
const PAGES_DIR = path.join(SRC, 'pages');
const ASSETS_DIR = path.join(SRC, 'assets');
const OUT = path.join(ROOT, 'docs');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

const md = new MarkdownIt({ html: true });
md.use(deflist);
md.renderer.rules.table_open = () => '<div class="docs-table-wrap">\n<table class="docs-table">\n';
md.renderer.rules.table_close = () => '</table>\n</div>\n';
md.renderer.rules.dl_open = () => '<dl class="docs-glossary">\n';
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  if (/^https?:/.test(tokens[i].attrGet('href') || '')) tokens[i].attrSet('rel', 'noopener');
  return self.renderToken(tokens, i, options);
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

class BuildError extends Error {}
const fail = (message) => { throw new BuildError(message); };


function listMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdown(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

function parseFrontMatter(text, source) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) fail(`${source}: missing front matter (--- block at the top)`);
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon < 0) fail(`${source}: bad front matter line "${line}"`);
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { data, body: text.slice(match[0].length) };
}

function substituteVars(text, vars, source) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) fail(`${source}: unknown variable {{${key}}} (add it to "vars" in site.json)`);
    return vars[key];
  });
}

function loadPages(site) {
  const pages = new Map();
  for (const file of listMarkdown(PAGES_DIR)) {
    const source = path.relative(PAGES_DIR, file).split(path.sep).join('/');
    const withoutExt = source.replace(/\.md$/, '');
    const isIndex = withoutExt === 'index' || withoutExt.endsWith('/index');
    const slug = withoutExt === 'index' ? 'index' : withoutExt.replace(/\/index$/, '');
    if (slug.split('/').length > 2) fail(`${source}: pages can only be one folder deep`);

    const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const { data, body } = parseFrontMatter(raw, source);
    for (const key of Object.keys(data)) data[key] = substituteVars(data[key], site.vars, source);
    for (const key of ['title', 'description']) {
      if (!data[key]) fail(`${source}: front matter needs "${key}"`);
    }
    if (slug !== 'index' && !data.summary) fail(`${source}: front matter needs "summary" (shown in section lists)`);

    pages.set(slug, {
      slug,
      source,
      file,
      isIndex,
      title: data.title,
      navTitle: data.nav_title || data.title,
      headTitle: data.head_title || data.title,
      description: data.description,
      lede: data.lede || '',
      summary: data.summary || '',
      hero: data.hero || '',
      heroAlt: data.hero_alt || '',
      heroCrop: data.hero_crop || '',
      body: substituteVars(body, site.vars, source),
      url: slug === 'index' ? '/docs/' : isIndex ? `/docs/${slug}/` : `/docs/${slug}.html`,
      outFile: path.join(OUT, ...(slug === 'index' ? ['index.html'] : isIndex ? [slug, 'index.html'] : [`${slug}.html`])),
    });
  }
  return pages;
}

function buildNav(site, pages) {
  const order = ['index'];
  const sectionOf = new Map([['index', null]]);
  const childrenOf = new Map();
  for (const { section, pages: children = [] } of site.nav) {
    order.push(section);
    sectionOf.set(section, section);
    childrenOf.set(section, children.map((name) => `${section}/${name}`));
    for (const slug of childrenOf.get(section)) {
      order.push(slug);
      sectionOf.set(slug, section);
    }
  }
  for (const slug of order) {
    if (!pages.has(slug)) fail(`site.json lists "${slug}", but there's no docs-src/pages/${slug}.md (or ${slug}/index.md)`);
  }
  if (new Set(order).size !== order.length) fail('site.json lists the same page twice');
  for (const page of pages.values()) {
    if (!sectionOf.has(page.slug)) fail(`${page.source} isn't in the nav. Add it to site.json`);
    page.section = sectionOf.get(page.slug);
  }
  return { order, childrenOf };
}

// ---------------------------------------------------------------- Rendering

const CONTAINER = /^::: *([a-z]+)[^\n]*\n([\s\S]*?)^:::[ \t]*$/gm;

function inlineText(inlineToken) {
  return inlineToken.children
    .filter((t) => t.type === 'text' || t.type === 'code_inline')
    .map((t) => t.content)
    .join('');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
}

function renderCards(inner, page, ctx) {
  const slugs = inner.split('\n').map((line) => line.trim()).filter(Boolean).flatMap((line) => {
    if (line !== 'children') return [line];
    if (!ctx.childrenOf.has(page.slug)) fail(`${page.source}: "children" only works on a section's index page`);
    return ctx.childrenOf.get(page.slug);
  });
  const items = slugs.map((slug) => {
    const target = ctx.pages.get(slug);
    if (!target) fail(`${page.source}: list points at unknown page "${slug}"`);
    return `  <li><a href="${target.url}">${esc(target.navTitle)}</a><span>${md.renderInline(target.summary)}</span></li>`;
  });
  return `<ul class="docs-links">\n${items.join('\n')}\n</ul>\n`;
}

// A set of code blocks in different languages, shown one at a time with a tab per language.
// docs.js keeps the chosen language in sync across every tab set on the page.
function renderTabs(inner, page, ctx) {
  const tokens = md.parse(inner, {});
  if (!tokens.length || tokens.some((t) => t.type !== 'fence')) fail(`${page.source}: "::: tabs" should only contain code blocks`);
  const langs = tokens.map((t) => t.info.trim().split(/\s+/)[0]);
  if (langs.some((lang) => !lang)) fail(`${page.source}: every code block in "::: tabs" needs a language, like \`\`\`csharp`);
  if (new Set(langs).size !== langs.length) fail(`${page.source}: "::: tabs" has two code blocks in the same language`);

  const group = ++ctx.tabGroups;
  const id = (lang) => `tabs-${group}-${lang.replace(/[^a-z0-9]/gi, '')}`;
  const label = (lang) => esc((ctx.site.codeLabels || {})[lang] || lang);
  const buttons = langs.map((lang, i) => `<button type="button" role="tab" id="${id(lang)}-tab" aria-controls="${id(lang)}"`
    + ` aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-lang="${esc(lang)}">${label(lang)}</button>`);
  const panels = tokens.map((token, i) => `<div class="docs-tabs-panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="${id(langs[i])}"`
    + ` aria-labelledby="${id(langs[i])}-tab" data-lang="${esc(langs[i])}"><pre><code class="language-${esc(langs[i])}">`
    + `${md.utils.escapeHtml(token.content)}</code></pre></div>`);
  return `<div class="docs-tabs">\n<div class="docs-tabs-bar" role="tablist" aria-label="Language">${buttons.join('')}</div>\n`
    + `${panels.join('\n')}\n</div>\n`;
}

function renderContainer(type, inner, page, ctx) {
  switch (type) {
    case 'tabs':
      return renderTabs(inner, page, ctx);
    case 'note':
      return `<div class="docs-note">\n${md.render(inner)}</div>\n`;
    case 'steps': {
      const html = md.render(inner);
      if (!html.startsWith('<ol')) fail(`${page.source}: "::: steps" should contain a numbered list`);
      return html.replace(/^<ol/, '<ol class="steps"');
    }
    case 'soon': {
      const html = md.render(inner);
      if (!html.startsWith('<ul>')) fail(`${page.source}: "::: soon" should contain a bullet list`);
      return html.replace(/^<ul>/, '<ul class="docs-soon">');
    }
    case 'cards':
      return renderCards(inner, page, ctx);
    default:
      return fail(`${page.source}: unknown block "::: ${type}" (use note, steps, soon, cards or tabs)`);
  }
}

function renderBody(page, ctx) {
  const blocks = [];
  const src = page.body.replace(CONTAINER, (_, type, inner) => {
    blocks.push(renderContainer(type, inner, page, ctx));
    return `\n\nDOCSBLOCK${blocks.length - 1}\n\n`;
  });

  const env = {};
  const tokens = md.parse(src, env);
  const toc = [];
  const used = new Set();
  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open') return;
    const text = inlineText(tokens[i + 1]);
    const base = slugify(text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    token.attrSet('id', id);
    if (token.tag === 'h2') toc.push({ id, text });
  });

  const html = md.renderer.render(tokens, md.options, env)
    .replace(/<p>DOCSBLOCK(\d+)<\/p>\n?/g, (_, n) => blocks[Number(n)]);
  return { html, toc };
}

function trailFor(page, ctx) {
  const trail = [{ label: 'Docs', url: '/docs/' }];
  if (page.slug === 'index') return trail;
  if (page.section && page.section !== page.slug) {
    const section = ctx.pages.get(page.section);
    trail.push({ label: section.navTitle, url: section.url });
  }
  trail.push({ label: page.navTitle, url: page.url });
  return trail;
}

function renderBreadcrumbs(page, ctx) {
  if (page.slug === 'index') return '      <nav class="breadcrumbs" aria-label="Breadcrumb"></nav>';
  const trail = trailFor(page, ctx);
  const items = trail.map((crumb, i) => (i === trail.length - 1
    ? `<li><span aria-current="page">${esc(crumb.label)}</span></li>`
    : `<li><a href="${crumb.url}">${esc(crumb.label)}</a></li>`));
  return `      <nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.join('')}</ol></nav>`;
}

function renderJsonLd(page, ctx) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trailFor(page, ctx).map((crumb, i) => ({
      '@type': 'ListItem', position: i + 1, name: crumb.label, item: ctx.site.siteUrl + crumb.url,
    })),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function renderSidebar(page, ctx) {
  const link = (target) => `<a href="${target.url}"${target === page ? ' aria-current="page"' : ''}>${esc(target.navTitle)}</a>`;
  const lines = [
    '      <p class="docs-nav-label">Documentation</p>',
    '      <button type="button" class="docs-nav-toggle" aria-expanded="false" aria-controls="docs-nav">Browse the docs</button>',
    '      <ul class="docs-nav" id="docs-nav">',
    `        <li>${link(ctx.pages.get('index'))}</li>`,
  ];
  for (const { section } of ctx.site.nav) {
    const children = ctx.childrenOf.get(section);
    if (page.section !== section || !children.length) {
      lines.push(`        <li>${link(ctx.pages.get(section))}</li>`);
      continue;
    }
    lines.push(`        <li>${link(ctx.pages.get(section))}`, '          <ul>');
    for (const slug of children) lines.push(`            <li>${link(ctx.pages.get(slug))}</li>`);
    lines.push('          </ul>', '        </li>');
  }
  lines.push('      </ul>');
  return lines.join('\n');
}

function renderToc(toc) {
  if (toc.length < 2) return '';
  return [
    '      <p class="docs-toc-title">On this page</p>',
    '      <ul>',
    ...toc.map((h) => `        <li><a href="#${h.id}">${esc(h.text)}</a></li>`),
    '      </ul>',
  ].join('\n');
}

function renderPager(page, ctx) {
  const i = ctx.order.indexOf(page.slug);
  const prev = ctx.pages.get(ctx.order[i - 1]);
  const next = ctx.pages.get(ctx.order[i + 1]);
  const link = (target, cls, label) => `<a class="${cls}" href="${target.url}"><span>${label}</span>${esc(target.navTitle)}</a>`;
  return `      <nav class="docs-pager" aria-label="Previous and next">${prev ? link(prev, 'prev', 'Previous') : ''}${next ? link(next, 'next', 'Next') : ''}</nav>`;
}

function imageSize(file) {
  const buf = fs.readFileSync(file);
  const ascii = (start, end) => buf.toString('ascii', start, end);
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (ascii(0, 4) === 'GIF8') return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    const chunk = ascii(12, 16);
    if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = buf.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let i = 2; i + 9 < buf.length && buf[i] === 0xff;) {
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

// hero_crop is "x y width height" in image pixels. The figure takes the crop's aspect ratio,
// and the image is scaled and offset inside it so only that region shows.
function renderHero(page) {
  if (!page.hero) return '';
  const file = path.join(ROOT, page.hero);
  if (!page.hero.startsWith('/') || !fs.existsSync(file)) fail(`${page.source}: hero image ${page.hero} doesn't exist`);
  const size = imageSize(file);
  const dims = size ? ` width="${size.width}" height="${size.height}"` : '';
  const img = (style) => `<img src="${esc(page.hero)}" alt="${esc(page.heroAlt)}"${dims}${style} fetchpriority="high">`;
  if (!page.heroCrop) return `        <figure class="docs-hero">${img('')}</figure>`;

  if (!size) fail(`${page.source}: can't read the size of ${page.hero}, so hero_crop can't be used with it`);
  const crop = page.heroCrop.split(/\s+/).map(Number);
  const [x, y, w, h] = crop;
  if (crop.length !== 4 || crop.some((n) => !Number.isFinite(n) || n < 0) || !w || !h) {
    fail(`${page.source}: hero_crop should be "x y width height" in pixels, got "${page.heroCrop}"`);
  }
  if (x + w > size.width || y + h > size.height) {
    fail(`${page.source}: hero_crop goes past the edge of ${page.hero} (${size.width}x${size.height})`);
  }
  const pct = (n) => `${Number(n.toFixed(4))}%`;
  const style = ` style="width: ${pct(size.width / w * 100)}; left: ${pct(-x / w * 100)}; top: ${pct(-y / h * 100)}"`;
  return `        <figure class="docs-hero docs-hero-crop" style="aspect-ratio: ${w} / ${h}">${img(style)}</figure>`;
}

function renderPage(page, ctx) {
  const { html, toc } = renderBody(page, ctx);
  const values = {
    source: page.source,
    headTitle: esc(page.headTitle),
    title: esc(page.title),
    description: esc(page.description),
    url: ctx.site.siteUrl + page.url,
    docsNavCurrent: page.slug === 'index' ? 'page' : 'true',
    engineRepo: ctx.site.vars.engineRepo,
    jsonLd: renderJsonLd(page, ctx),
    sidebar: renderSidebar(page, ctx),
    breadcrumbs: renderBreadcrumbs(page, ctx),
    lede: page.lede ? `        <p class="lede">${md.renderInline(page.lede)}</p>` : '',
    hero: renderHero(page),
    content: html.trimEnd(),
    toc: renderToc(toc),
    pager: renderPager(page, ctx),
    editUrl: `${ctx.site.editUrl}/${page.source}`,
  };
  return ctx.template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) fail(`template.html: unknown placeholder {{${key}}}`);
    return values[key];
  });
}

// ---------------------------------------------------------------- Checks and sitemap

function checkLinks(ctx, rendered) {
  const byUrl = new Map([...ctx.pages.values()].map((p) => [p.url, rendered.get(p.slug)]));
  const problems = [];
  for (const [slug, html] of rendered) {
    const page = ctx.pages.get(slug);
    for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|\/\/)/.test(target)) continue;
      const [urlPath, hash] = target.split('#');
      let targetHtml = html;
      if (urlPath) {
        if (!urlPath.startsWith('/')) { problems.push(`${page.source}: use absolute links, not "${target}"`); continue; }
        if (urlPath.startsWith('/docs/') && !/\.(css|js)$/.test(urlPath)) {
          targetHtml = byUrl.get(urlPath);
          if (!targetHtml) { problems.push(`${page.source}: broken link ${target}`); continue; }
        } else {
          const onDisk = path.join(ROOT, urlPath, urlPath.endsWith('/') ? 'index.html' : '');
          const inAssets = urlPath.startsWith('/docs/') && fs.existsSync(path.join(ASSETS_DIR, path.basename(urlPath)));
          if (!fs.existsSync(onDisk) && !inAssets) { problems.push(`${page.source}: missing file ${target}`); continue; }
          targetHtml = null;
        }
      }
      if (hash && targetHtml && !targetHtml.includes(`id="${hash}"`)) problems.push(`${page.source}: no heading "#${hash}" at ${urlPath || 'this page'}`);
    }
  }
  if (problems.length) fail(`link check failed:\n  ${problems.join('\n  ')}`);
}

function lastModified(file) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (date) return date;
  } catch { /* not a git checkout */ }
  return new Date().toLocaleDateString('en-CA');
}

function updateSitemap(ctx) {
  const original = fs.readFileSync(SITEMAP, 'utf8');
  const nl = original.includes('\r\n') ? '\r\n' : '\n';
  const entries = ctx.order.map((slug) => {
    const page = ctx.pages.get(slug);
    return [
      '  <url>',
      `    <loc>${ctx.site.siteUrl}${page.url}</loc>`,
      `    <lastmod>${lastModified(page.file)}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      `    <priority>${slug === 'index' ? '0.8' : '0.6'}</priority>`,
      '  </url>',
    ].join(nl) + nl;
  }).join('');
  const updated = original
    .replace(/[ \t]*<url>\s*<loc>[^<]*\/docs\/[^<]*<\/loc>[\s\S]*?<\/url>\r?\n?/g, '')
    .replace('</urlset>', `${entries}</urlset>`);
  if (updated !== original) fs.writeFileSync(SITEMAP, updated);
}

// ---------------------------------------------------------------- Build

function build({ sitemap }) {
  const site = JSON.parse(fs.readFileSync(path.join(SRC, 'site.json'), 'utf8'));
  const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8').replace(/\r\n/g, '\n');
  const pages = loadPages(site);
  const { order, childrenOf } = buildNav(site, pages);
  const ctx = { site, template, pages, order, childrenOf, tabGroups: 0 };

  const rendered = new Map(order.map((slug) => [slug, renderPage(pages.get(slug), ctx)]));
  checkLinks(ctx, rendered);

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(ASSETS_DIR, OUT, { recursive: true });
  for (const [slug, html] of rendered) {
    const { outFile } = pages.get(slug);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
  }
  if (sitemap) updateSitemap(ctx);
  return rendered.size;
}

function run(options) {
  try {
    const count = build(options);
    console.log(`docs: built ${count} pages into docs/`);
    return true;
  } catch (err) {
    if (!(err instanceof BuildError)) throw err;
    console.error(`docs: build failed\n${err.message}`);
    return false;
  }
}

if (process.argv.includes('--watch')) {
  run({ sitemap: false });
  let timer;
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => run({ sitemap: false }), 100);
  });
  console.log('docs: watching docs-src/ (sitemap is only updated by a full build)');
} else if (!run({ sitemap: true })) {
  process.exit(1);
}
