import { WIKI_PAGE_META } from '../seo/pageMetadata.js';

// Saubere Anzeigenamen (mit echten Umlauten) pro Route — Quelle ist das
// SEO-Metadaten-h1. Die aus Dateinamen abgeleiteten Labels sind sonst
// transliteriert ("Anfaenger Guide") oder falsch groß ("EinfüHrung").
const DISPLAY_NAME_BY_PATH = new Map(WIKI_PAGE_META.map((page) => [page.path, page.h1]));

const CONTENT_MODULES = import.meta.glob('/src/content/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const NAV_FOOTER_EXCLUDES = new Set(['home', 'impressum', 'privacy', 'regelwerk']);

function transliterateGerman(value = '') {
  return String(value)
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

export function slugifySegment(value = '') {
  return transliterateGerman(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeLookup(value = '') {
  return transliterateGerman(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function toLabel(segment = '') {
  return String(segment)
    .replace(/[-_]+/g, ' ')
    // Nur den ersten Buchstaben jedes Wortes groß — Unicode-sicher, damit
    // Umlaute (ä/ö/ü) nicht als Wortgrenze zählen und "EinfüHrung" erzeugen.
    .replace(/(^|\s)(\p{L})/gu, (_match, boundary, char) => boundary + char.toUpperCase());
}

function createLookupKeys(relativePath, slugSegments, originalSegments) {
  const joinedOriginal = originalSegments.join('/');
  const joinedSlug = slugSegments.join('/');
  const fileName = originalSegments[originalSegments.length - 1];
  const slugName = slugSegments[slugSegments.length - 1];

  const keys = new Set([
    normalizeLookup(relativePath),
    normalizeLookup(joinedOriginal),
    normalizeLookup(joinedSlug),
    normalizeLookup(joinedOriginal.replace(/\//g, '')),
    normalizeLookup(joinedSlug.replace(/\//g, '')),
    normalizeLookup(`wiki/${joinedOriginal}`),
    normalizeLookup(`wiki/${joinedSlug}`),
  ]);

  // Bare fileName/slugName keys are only unambiguous for top-level entries;
  // nested files often share a base name (e.g. befehle.md across folders),
  // so registering short keys there would let later entries clobber earlier
  // ones and resolve lookups to the wrong page.
  if (originalSegments.length === 1) {
    keys.add(normalizeLookup(fileName));
    keys.add(normalizeLookup(slugName));
  }

  return keys;
}

function createEntry(modulePath) {
  const relativePath = modulePath.replace('/src/content/', '').replace(/\.md$/, '');
  const originalSegments = relativePath.split('/');
  const slugSegments = originalSegments.map(slugifySegment);
  const isHome = normalizeLookup(relativePath) === 'home';
  const route = isHome ? '/' : `/wiki/${slugSegments.join('/')}`;
  const labels = originalSegments.map(toLabel);

  return {
    isHome,
    isNested: originalSegments.length > 1,
    isNavigableTopLevel:
      originalSegments.length === 1 && !NAV_FOOTER_EXCLUDES.has(slugSegments[0]),
    labels,
    lookupKeys: createLookupKeys(relativePath, slugSegments, originalSegments),
    originalSegments,
    relativePath,
    route,
    slugSegments,
    sourcePath: modulePath,
    title: DISPLAY_NAME_BY_PATH.get(route) || labels[labels.length - 1],
  };
}

export const CONTENT_ENTRIES = Object.keys(CONTENT_MODULES)
  .sort((left, right) => left.localeCompare(right, 'de'))
  .map(createEntry);

export const HOME_ENTRY = CONTENT_ENTRIES.find((entry) => entry.isHome) ?? null;

export function getContentEntryBySlug(slug = '') {
  if (!slug) {
    return HOME_ENTRY;
  }

  const normalizedSlug = normalizeLookup(slug);
  return (
    CONTENT_ENTRIES.find((entry) => entry.lookupKeys.has(normalizedSlug)) ?? null
  );
}

export function getContentEntryByRoute(pathname = '/') {
  if (pathname === '/') {
    return HOME_ENTRY;
  }

  const normalizedPath = pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/^wiki\//, '');
  return getContentEntryBySlug(normalizedPath);
}

export function loadContentByEntry(entry) {
  if (!entry) {
    return null;
  }

  return CONTENT_MODULES[entry.sourcePath];
}

const NAV_TOP_LEVEL_ORDER = ['/wiki/anfaenger-guide', '/wiki/server-systeme', '/wiki/faq'];

// Logische Sidebar-Kategorien. Bewusst von der Ordnerstruktur ENTKOPPELT: die
// URLs (Ordner/Datei) und damit SEO/Indexierung bleiben stabil, die Navigation
// wird aber sinnvoll gruppiert statt alles in einen "Anderes"-Topf zu werfen.
const NAV_CATEGORIES = [
  {
    name: 'Erste Schritte',
    routes: [
      '/wiki/anderes/einfuehrung',
      '/wiki/anderes/befehle',
      '/wiki/anderes/erlaubte-mods',
      '/wiki/anderes/abstimmen',
    ],
  },
  {
    name: 'Jobs & Berufe',
    routes: [
      '/wiki/jobs/allgemein',
      '/wiki/jobs/berufe',
      '/wiki/jobs/forscher',
      '/wiki/jobs/siegelmagier',
      '/wiki/jobs/runenmechaniker',
      '/wiki/jobs/angeln',
      '/wiki/jobs/befehle',
    ],
  },
  {
    name: 'Citybuild & Welt',
    routes: [
      '/wiki/anderes/citybuild',
      '/wiki/anderes/farmwelt',
      '/wiki/anderes/warps',
      '/wiki/anderes/kistenshops',
    ],
  },
  {
    name: 'Kulte & Fraktionen',
    routes: [
      '/wiki/kult/allgemein',
      '/wiki/kult/kulte',
      '/wiki/kult/levelsystem',
      '/wiki/kult/raenge',
      '/wiki/kult/fraktionen',
      '/wiki/kult/wochenmarkt',
      '/wiki/kult/befehle',
    ],
  },
  {
    name: 'Belohnungen',
    routes: ['/wiki/anderes/kisten', '/wiki/anderes/daily-quests'],
  },
  {
    name: 'Aktivitäten',
    routes: ['/wiki/anderes/labyrinth'],
  },
];

// Nested-Seiten, die bewusst NICHT in der Sidebar erscheinen (durch die neuen
// Kategorien ersetzt), aber als URL weiterhin erreichbar bleiben.
const NAV_HIDDEN_ROUTES = new Set(['/wiki/anderes/allgemein']);

export function getNavigationStructure() {
  const byRoute = new Map(CONTENT_ENTRIES.map((entry) => [entry.route, entry]));
  const toLink = (entry) => ({ name: entry.title, path: entry.route });

  // Top-Level: erst in definierter Reihenfolge, dann evtl. neue Seiten anhängen.
  const topLevel = NAV_TOP_LEVEL_ORDER.map((path) => byRoute.get(path))
    .filter(Boolean)
    .map(toLink);
  CONTENT_ENTRIES.filter(
    (entry) => entry.isNavigableTopLevel && !NAV_TOP_LEVEL_ORDER.includes(entry.route),
  )
    .sort((left, right) => left.title.localeCompare(right.title, 'de'))
    .forEach((entry) => topLevel.push(toLink(entry)));

  // Kategorien in definierter Reihenfolge, leere werden weggelassen.
  const categorized = new Set();
  const folders = NAV_CATEGORIES.map((category) => ({
    name: category.name,
    items: category.routes
      .map((path) => {
        const entry = byRoute.get(path);
        if (entry) categorized.add(path);
        return entry;
      })
      .filter(Boolean)
      .map(toLink),
  })).filter((folder) => folder.items.length > 0);

  // Fallback: nested Seiten ohne Kategorie behalten ihre Ordner-Gruppe, damit
  // neu hinzugefügte Inhalte nie stillschweigend aus der Navigation fallen.
  const leftovers = new Map();
  CONTENT_ENTRIES.filter(
    (entry) =>
      entry.isNested &&
      !categorized.has(entry.route) &&
      !NAV_HIDDEN_ROUTES.has(entry.route),
  ).forEach((entry) => {
    const key = entry.labels[0];
    if (!leftovers.has(key)) leftovers.set(key, []);
    leftovers.get(key).push(toLink(entry));
  });
  Array.from(leftovers.entries())
    .sort(([left], [right]) => left.localeCompare(right, 'de'))
    .forEach(([name, items]) => {
      folders.push({
        name,
        items: items.sort((left, right) => left.name.localeCompare(right.name, 'de')),
      });
    });

  return { folders, topLevel };
}
