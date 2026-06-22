import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const siteUrl = process.env.VITE_SITE_URL || 'https://carbonited.com';
const ogImage = `${siteUrl}/og-image.png`;

const projects = [
  { id: 'turkiye-ruzgar', title: { tr: 'Türkiye Rüzgar Enerjisi Projesi', en: 'Turkey Wind Energy Project' }, desc: { tr: 'Türkiye rüzgar enerjisi tokenize karbon kredisi projesi.', en: 'Tokenized wind energy carbon credit project in Turkey.' }, image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=630&fit=crop' },
  { id: 'karadeniz-orman', title: { tr: 'Karadeniz Orman Restorasyonu', en: 'Black Sea Forest Restoration' }, desc: { tr: 'Orman restorasyonu ve karbon tutulumu projesi.', en: 'Forest restoration and carbon sequestration project.' }, image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=630&fit=crop' },
  { id: 'ege-gunes', title: { tr: 'Ege Güneş Enerjisi Santrali', en: 'Aegean Solar Power Plant' }, desc: { tr: 'Güneş enerjisi karbon azaltım projesi.', en: 'Solar energy carbon reduction project.' }, image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&h=630&fit=crop' },
  { id: 'marmara-mavi', title: { tr: 'Marmara Mavi Karbon Koruma', en: 'Marmara Blue Carbon Protection' }, desc: { tr: 'Mavi karbon ekosistem koruma projesi.', en: 'Blue carbon ecosystem protection project.' }, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop' },
  { id: 'istanbul-atik', title: { tr: 'İstanbul Atık Dönüşüm Tesisi', en: 'Istanbul Waste Conversion Facility' }, desc: { tr: 'Atık yönetimi karbon azaltım projesi.', en: 'Waste management carbon reduction project.' }, image: `${siteUrl}/og-image.png` },
  { id: 'anadolu-biyokutle', title: { tr: 'Anadolu Biyokütle Enerji Projesi', en: 'Anatolia Biomass Energy Project' }, desc: { tr: 'Biyokütle enerji karbon kredisi projesi.', en: 'Biomass energy carbon credit project.' }, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630&fit=crop' },
];

const staticPages = [
  { path: 'gizlilik', title: 'Gizlilik Politikası — Carbonited', description: 'Carbonited gizlilik politikası. Kişisel verilerinizin nasıl toplandığı ve korunduğu.' },
  { path: 'sartlar', title: 'Kullanım Şartları — Carbonited', description: 'Carbonited platform kullanım şartları ve hizmet koşulları.' },
  { path: 'iletisim', title: 'İletişim — Carbonited', description: 'Carbonited ile iletişime geçin. Kurumsal satış, proje başvurusu ve teknik destek.' },
  { path: 'portfoy', title: 'Portföyüm — Karbon Kredilerim | Carbonited', description: 'Carbonited portföyünüzdeki tokenize karbon kredilerini yönetin.' },
];

function renderOgHtml({ title, description, url, image, redirect }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Carbonited" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${redirect}" />
  <script>location.replace(${JSON.stringify(redirect)})</script>
</head>
<body>
  <p><a href="${redirect}">${title}</a></p>
</body>
</html>`;
}

function writePage(relativeDir, html) {
  const dir = join(root, 'public', relativeDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
}

for (const p of projects) {
  const title = `${p.title.tr} | Karbon Kredisi — Carbonited`;
  const url = `${siteUrl}/proje/${p.id}`;
  const redirect = `/proje/${p.id}`;
  writePage(
    join('prerender', 'proje', p.id),
    renderOgHtml({ title, description: p.desc.tr, url, image: p.image, redirect })
  );

  const purchaseTitle = `${p.title.tr} Karbon Kredisi Satın Al — Carbonited`;
  const purchaseUrl = `${siteUrl}/proje/${p.id}/satin-al`;
  writePage(
    join('prerender', 'proje', p.id, 'satin-al'),
    renderOgHtml({ title: purchaseTitle, description: p.desc.tr, url: purchaseUrl, image: p.image, redirect: `/proje/${p.id}/satin-al` })
  );
}

for (const page of staticPages) {
  const url = `${siteUrl}/${page.path}`;
  writePage(join('prerender', page.path), renderOgHtml({
    title: page.title,
    description: page.description,
    url,
    image: ogImage,
    redirect: `/${page.path}`,
  }));
}

console.log('Generated prerender OG HTML for social crawlers.');
