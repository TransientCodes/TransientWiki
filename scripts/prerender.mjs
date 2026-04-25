import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distRoot = path.join(projectRoot, 'dist');
const templatePath = path.join(distRoot, 'index.html');
const serverEntryUrl = pathToFileURL(path.join(distRoot, 'server', 'entry-server.js')).href;

const { getPrerenderRoutes, getSeo, render } = await import(serverEntryUrl);
const template = await fs.readFile(templatePath, 'utf8');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildHead(seo) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);
  const robots = escapeHtml(seo.robots);
  const type = escapeHtml(seo.type);

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${canonical}">`,
    '<meta property="og:locale" content="de_DE">',
    '<meta property="og:site_name" content="TransientRealm Wiki">',
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    '<meta property="og:image" content="https://wiki.transientrealm.de/logo.png">',
    '<meta property="og:image:alt" content="TransientRealm Wiki Logo">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    '<meta name="twitter:image" content="https://wiki.transientrealm.de/logo.png">',
    `<script type="application/ld+json">${escapeJsonForHtml(seo.jsonLd)}</script>`,
  ].join('\n    ');
}

async function writeHtmlForRoute(route, html) {
  if (route === '/') {
    await fs.writeFile(path.join(distRoot, 'index.html'), html);
    return;
  }

  const cleanRoute = route.replace(/^\/+/, '');
  const directoryPath = path.join(distRoot, cleanRoute);
  await fs.mkdir(directoryPath, { recursive: true });
  await fs.writeFile(path.join(directoryPath, 'index.html'), html);
  await fs.writeFile(path.join(distRoot, `${cleanRoute}.html`), html);
}

function buildPage(route) {
  const seo = getSeo(route);
  const appHtml = render(route);

  return template
    .replace('<!--seo-head-->', buildHead(seo))
    .replace('<!--app-html-->', appHtml);
}

function getRoutePriority(route) {
  if (route === '/') return '1.0';
  if (route === '/wiki/server-systeme' || route === '/wiki/anfaenger-guide') return '0.9';
  if (route.includes('/jobs/') || route.includes('/anderes/') || route.includes('/kult/')) return '0.7';
  return '0.8';
}

function buildSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const items = routes
    .map((route) => {
      const seo = getSeo(route);
      const changefreq = route === '/' ? 'daily' : route === '/wiki/regelwerk' ? 'monthly' : 'weekly';

      return `  <url>
    <loc>${seo.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${getRoutePriority(route)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

const routes = getPrerenderRoutes();

for (const route of routes) {
  await writeHtmlForRoute(route, buildPage(route));
}

await fs.writeFile(
  path.join(distRoot, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: https://wiki.transientrealm.de/sitemap.xml\n',
);
await fs.writeFile(path.join(distRoot, 'sitemap.xml'), buildSitemap(routes));
await fs.writeFile(path.join(distRoot, '404.html'), buildPage('/'));
await fs.rm(path.join(distRoot, 'server'), { recursive: true, force: true });

console.log(`Prerendered ${routes.length} routes.`);
