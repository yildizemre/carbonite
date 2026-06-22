import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const siteUrl = process.env.VITE_SITE_URL || 'https://carbonited.com';
const ogImage = `${siteUrl}/og-image.png`;

const staticPages = [
  { path: 'hakkimizda', title: 'Biz Kimiz — Carbonited', description: 'Carbonited ekibi, vizyonu ve yeşil ekonomi altyapısı hakkında bilgi edinin.' },
  { path: 'gizlilik', title: 'Gizlilik Politikası — Carbonited', description: 'Carbonited gizlilik politikası. Kişisel verilerinizin nasıl toplandığı ve korunduğu.' },
  { path: 'etik-ilkeler', title: 'Etik İlkeler — Carbonited', description: 'CARBONITED DMCC etik ilkeleri ve kurumsal davranış standartları.' },
  { path: 'sartlar', title: 'Kullanım Şartları — Carbonited', description: 'Carbonited platform kullanım şartları ve hizmet koşulları.' },
  { path: 'iletisim', title: 'İletişim — Carbonited', description: 'Carbonited ile iletişime geçin. Kurumsal satış, proje başvurusu ve teknik destek.' },
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
