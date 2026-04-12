export const SITE_URL = 'https://wiki.transientrealm.de';
export const SITE_NAME = 'TransientRealm Wiki';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
export const DEFAULT_TITLE =
  'TransientRealm Wiki | Deutsches Minecraft-Server-Wiki für Jobs, Siegel, Quests und Systeme';
export const DEFAULT_DESCRIPTION =
  'Offizielles deutsches Wiki für den Minecraft-Server TransientRealm mit Guides zu Jobs, Berufen, Siegeln, Quests, Citybuild, Rängen, Kisten, Wirtschaft und Server-Systemen.';

const PAGE_OVERRIDES = {
  '/': {
    description:
      'TransientRealm Wiki ist ein deutschsprachiges Minecraft-Server-Wiki mit Anleitungen und Erklärungen zu Jobs, Berufen, Siegeln, Quests, Citybuild, Kisten, Rängen, Wirtschaft und weiteren Spielsystemen.',
    title: DEFAULT_TITLE,
    type: 'website',
  },
  '/wiki/anfaenger-guide': {
    description:
      'Anfänger-Guide für TransientRealm: Einstieg in den deutschen Minecraft-Server mit Spawn, Plot, Jobs, Farmwelt, Quests, Kisten und ersten Fortschrittssystemen.',
    title:
      'Anfänger-Guide | Einstieg in den deutschen Minecraft-Server TransientRealm',
  },
  '/wiki/anderes/einfuehrung': {
    description:
      'Erste Schritte auf TransientRealm: Plot sichern, Jobs wählen, Farmwelt nutzen, Quests starten und die wichtigsten Server-Systeme schnell verstehen.',
    title:
      'Erste Schritte | TransientRealm Wiki für Citybuild, Jobs und Server-Systeme',
  },
  '/wiki/server-systeme': {
    description:
      'Überblick über die wichtigsten Minecraft-Server-Spielsysteme auf TransientRealm: Jobs, Citybuild, Kulte, Wirtschaft, Quests, Kisten, Progression und besondere Features.',
    title:
      'Server-Systeme | Minecraft-Server-Spielsysteme, Jobs und Features erklärt',
  },
  '/wiki/faq': {
    description:
      'FAQ zum deutschen Minecraft-Server TransientRealm mit Antworten zu Einstieg, Jobs, Citybuild, Quests, Kisten, Rängen, Wirtschaft und wichtigen Befehlen.',
    title: 'FAQ | Häufige Fragen zum deutschen Minecraft-Server TransientRealm',
  },
  '/wiki/jobs/berufe': {
    description:
      'Übersicht der Jobs und Berufe auf TransientRealm: Pfund verdienen, Job-XP sammeln und besondere Minecraft-Server-Systeme wie Angeln, Siegel und Runen freischalten.',
    title:
      'Jobs & Berufe | Minecraft Jobs-System im TransientRealm Wiki',
  },
  '/wiki/jobs/siegelmagier': {
    description:
      'Guide zum Siegelmagier auf TransientRealm: Siegel, Auren, Veredelungen und magische Item-Systeme für ein deutsches Minecraft-Server-Wiki verständlich erklärt.',
    title:
      'Siegelmagier | Siegel, Verzauberungen und Custom-Items im TransientRealm Wiki',
  },
  '/wiki/jobs/runenmechaniker': {
    description:
      'Runenmechaniker-Guide für TransientRealm mit Überblick zu Runen, Crafting, Materialien und servereigenen RPG-Elementen.',
    title: 'Runenmechaniker | Runen und Crafting-Systeme im TransientRealm Wiki',
  },
  '/wiki/jobs/forscher': {
    description:
      'Forscher-Guide für TransientRealm: Artefakte, Archäologie, Progression und seltene Funde als Teil der Minecraft-Server-Spielsysteme.',
    title: 'Forscher | Archäologie, Artefakte und Progression im TransientRealm Wiki',
  },
  '/wiki/anderes/citybuild': {
    description:
      'Alles zum Citybuild-System auf TransientRealm: Plot sichern, bauen, handeln und den deutschen Minecraft-Server strukturiert kennenlernen.',
    title: 'Citybuild | Plot-, Bau- und Handelssysteme im TransientRealm Wiki',
  },
  '/wiki/anderes/daily-quests': {
    description:
      'Daily-Quests-Guide für TransientRealm mit Belohnungen, Abläufen und Tipps zum täglichen Fortschritt auf dem Minecraft-Server.',
    title: 'Daily Quests | Quests und täglicher Fortschritt im TransientRealm Wiki',
  },
  '/wiki/anderes/kisten': {
    description:
      'Kisten- und Crate-System im TransientRealm Wiki: Belohnungen, Fortschritt, Ectoplasma und servereigene Loot-Systeme erklärt.',
    title: 'Kisten | Crates, Belohnungen und Fortschritt im TransientRealm Wiki',
  },
  '/wiki/kult/kulte': {
    description:
      'Kulte auf TransientRealm: Gemeinschaften, Wirtschaft, Rubine, Fortschritt und soziale Server-Systeme im deutschen Minecraft-Server-Wiki.',
    title: 'Kulte | Fraktionen, Gemeinschaften und Progression im TransientRealm Wiki',
  },
  '/wiki/kult/fraktionen': {
    description:
      'Fraktionen auf TransientRealm: Zugehörigkeit, Vorteile und Zusammenhänge mit Kulten und Progression im Server-Wiki.',
    title: 'Fraktionen | Gruppensysteme und Progression im TransientRealm Wiki',
  },
  '/wiki/regelwerk': {
    description:
      'Regelwerk des deutschen Minecraft-Servers TransientRealm mit klaren Verhaltensregeln und den wichtigsten Grundlagen für ein faires Miteinander.',
    title: 'Regelwerk | Server-Regeln im TransientRealm Wiki',
  },
};

function stripMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstHeading(markdown = '', fallback = SITE_NAME) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match?.[1]?.trim()) {
    return match[1].trim();
  }

  const htmlHeadingMatch = markdown.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return htmlHeadingMatch?.[1]?.trim() || fallback;
}

function firstParagraph(markdown = '') {
  const cleaned = markdown
    .split(/\n{2,}/)
    .map((block) => stripMarkdown(block))
    .find((block) => block.length > 110);

  return cleaned || DEFAULT_DESCRIPTION;
}

function truncate(value, maxLength = 165) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getPageMetadata({ content = '', entry = null, isNotFound = false, pathname = '/' }) {
  if (isNotFound) {
    return {
      canonical: `${SITE_URL}${pathname === '/' ? '/' : pathname}`,
      description:
        'Die angeforderte Wiki-Seite wurde nicht gefunden. Nutze die Startseite oder die Suche, um passende Inhalte zu Jobs, Quests, Citybuild und weiteren Server-Systemen zu finden.',
      robots: 'noindex,follow',
      title: `Seite nicht gefunden | ${SITE_NAME}`,
      type: 'website',
    };
  }

  const override = PAGE_OVERRIDES[pathname] ?? null;
  const fallbackTitle = entry?.isHome
    ? DEFAULT_TITLE
    : `${firstHeading(content, entry?.title || SITE_NAME)} | ${SITE_NAME}`;

  return {
    canonical: `${SITE_URL}${pathname === '/' ? '/' : pathname}`,
    description: override?.description || truncate(firstParagraph(content)),
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    title: override?.title || fallbackTitle,
    type: override?.type || (entry?.isHome ? 'website' : 'article'),
  };
}
