import { getProject, getProjects } from './data.js';
import { content, getLang } from './content.js';

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://carbonited.com';
export const SITE_NAME = 'Carbonited';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const KEYWORDS = {
  tr: 'karbon kredisi, karbon offset, tokenize karbon, emisyon dengeleme, karbon pazaryeri, carbon credits, carbonited, kurumsal karbon, VCS, Gold Standard',
  en: 'carbon credits, carbon offset, tokenized carbon, emission offsetting, carbon marketplace, carbonited, corporate carbon, VCS, Gold Standard, climate projects',
};

function upsertMeta(attr, key, contentValue) {
  if (!contentValue) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', contentValue);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function getRouteSeo(route, lang = getLang()) {
  const seo = content[lang].seo;
  const keywords = KEYWORDS[lang];

  switch (route.page) {
    case 'detail': {
      const p = getProject(route.id, lang);
      return {
        title: seo.detailTitle(p.title),
        description: seo.detailDescription(p),
        keywords: `${keywords}, ${p.title}, ${p.projectType}, ${p.registry}`,
        path: `/proje/${p.id}`,
        ogType: 'article',
        image: p.heroImage,
      };
    }
    case 'purchase': {
      const p = getProject(route.id, lang);
      return {
        title: seo.purchaseTitle(p.title),
        description: seo.purchaseDescription(p),
        keywords: `${keywords}, ${p.title}`,
        path: `/proje/${p.id}/satin-al`,
        ogType: 'website',
        image: p.image,
      };
    }
    case 'portfolio':
      return {
        title: seo.portfolioTitle,
        description: seo.portfolioDescription,
        keywords,
        path: '/portfoy',
        ogType: 'website',
      };
    case 'privacy':
      return {
        title: seo.privacyTitle,
        description: seo.privacyDescription,
        keywords,
        path: '/gizlilik',
        ogType: 'website',
      };
    case 'terms':
      return {
        title: seo.termsTitle,
        description: seo.termsDescription,
        keywords,
        path: '/sartlar',
        ogType: 'website',
      };
    case 'contact':
      return {
        title: seo.contactTitle,
        description: seo.contactDescription,
        keywords,
        path: '/iletisim',
        ogType: 'website',
      };
    default:
      return {
        title: seo.homeTitle,
        description: seo.homeDescription,
        keywords,
        path: '/',
        ogType: 'website',
      };
  }
}

export function applySeo(route, lang = getLang()) {
  const seo = getRouteSeo(route, lang);
  const canonical = `${SITE_URL}${seo.path}`;
  const t = content[lang];

  document.title = seo.title;
  document.documentElement.lang = lang === 'tr' ? 'tr' : 'en';

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'keywords', seo.keywords);
  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  upsertMeta('name', 'author', SITE_NAME);
  upsertMeta('name', 'application-name', SITE_NAME);

  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:locale', lang === 'tr' ? 'tr_TR' : 'en_US');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', seo.ogType);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', seo.image || DEFAULT_OG_IMAGE);
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:type', 'image/png');
  upsertMeta('property', 'og:image:alt', seo.title);

  if (lang === 'tr') {
    upsertMeta('property', 'og:locale:alternate', 'en_US');
  } else {
    upsertMeta('property', 'og:locale:alternate', 'tr_TR');
  }

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', seo.image || DEFAULT_OG_IMAGE);

  applyStructuredData(route, seo, canonical, lang, t);
}

function applyStructuredData(route, seo, canonical, lang, t) {
  const orgDesc = lang === 'tr'
    ? 'Dijital karbon kredilerini tokenize eden kurumsal likidite katmanı.'
    : 'Enterprise liquidity layer for tokenized digital carbon credits.';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/Carbonited%20Logo.png`,
    description: orgDesc,
    sameAs: ['https://app.carbonited.com'],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: seo.description,
    inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  organization['@id'] = `${SITE_URL}/#organization`;

  const graphs = [organization, website];
  const projects = getProjects(lang);
  const c = t.common;

  if (route.page === 'market') {
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonical,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    });

    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: c.projects,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${SITE_URL}/proje/${p.id}`,
      })),
    });
  }

  if (route.page === 'detail') {
    const p = getProject(route.id, lang);
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.title,
      description: p.description,
      image: p.heroImage,
      url: canonical,
      category: p.projectType,
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'TRY',
        price: p.price.replace(/[^\d]/g, '') || '800',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/proje/${p.id}/satin-al`,
      },
    });

    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.marketplace, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: c.projects, item: SITE_URL },
        { '@type': 'ListItem', position: 3, name: p.title, item: canonical },
      ],
    });
  }

  if (route.page === 'purchase') {
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.marketplace, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: c.projects, item: SITE_URL },
        { '@type': 'ListItem', position: 3, name: c.purchase, item: canonical },
      ],
    });
  }

  if (route.page === 'portfolio') {
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonical,
    });
  }

  upsertJsonLd('jsonld-seo', { '@context': 'https://schema.org', '@graph': graphs });
}

export function buildSitemapXml() {
  const projects = getProjects('tr');
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/portfoy', priority: '0.8', changefreq: 'weekly' },
    { loc: '/gizlilik', priority: '0.5', changefreq: 'monthly' },
    { loc: '/sartlar', priority: '0.5', changefreq: 'monthly' },
    { loc: '/iletisim', priority: '0.6', changefreq: 'monthly' },
    ...projects.flatMap((p) => [
      { loc: `/proje/${p.id}`, priority: '0.9', changefreq: 'weekly' },
      { loc: `/proje/${p.id}/satin-al`, priority: '0.7', changefreq: 'weekly' },
    ]),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
