const CONTENT_MODULES = import.meta.glob('/src/content/**/*.md', {
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
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function createLookupKeys(relativePath, slugSegments, originalSegments) {
  const joinedOriginal = originalSegments.join('/');
  const joinedSlug = slugSegments.join('/');
  const fileName = originalSegments[originalSegments.length - 1];
  const slugName = slugSegments[slugSegments.length - 1];

  return new Set([
    normalizeLookup(relativePath),
    normalizeLookup(joinedOriginal),
    normalizeLookup(joinedSlug),
    normalizeLookup(fileName),
    normalizeLookup(slugName),
    normalizeLookup(joinedOriginal.replace(/\//g, '')),
    normalizeLookup(joinedSlug.replace(/\//g, '')),
    normalizeLookup(`wiki/${joinedOriginal}`),
    normalizeLookup(`wiki/${joinedSlug}`),
  ]);
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
    title: labels[labels.length - 1],
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

export async function loadContentByEntry(entry) {
  if (!entry) {
    return null;
  }

  return CONTENT_MODULES[entry.sourcePath]();
}

export function getNavigationStructure() {
  const topLevel = CONTENT_ENTRIES.filter((entry) => entry.isNavigableTopLevel)
    .sort((left, right) => left.title.localeCompare(right.title, 'de'))
    .map((entry) => ({
      name: entry.title,
      path: entry.route,
    }));

  const folders = new Map();

  CONTENT_ENTRIES.filter((entry) => entry.isNested).forEach((entry) => {
    const folderName = entry.labels[0];
    if (!folders.has(folderName)) {
      folders.set(folderName, []);
    }

    folders.get(folderName).push({
      name: entry.title,
      path: entry.route,
    });
  });

  return {
    folders: Array.from(folders.entries())
      .sort(([left], [right]) => left.localeCompare(right, 'de'))
      .map(([name, items]) => ({
        items: items.sort((left, right) => left.name.localeCompare(right.name, 'de')),
        name,
      })),
    topLevel,
  };
}
