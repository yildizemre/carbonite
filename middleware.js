export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const isBot = /(bot|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|googlebot|bingbot|preview)/i.test(ua);
  if (!isBot) return;

  const { pathname } = new URL(request.url);
  let target = null;

  const purchase = pathname.match(/^\/proje\/([^/]+)\/satin-al$/);
  if (purchase) target = `/prerender/proje/${purchase[1]}/satin-al/index.html`;

  const detail = pathname.match(/^\/proje\/([^/]+)$/);
  if (!target && detail) target = `/prerender/proje/${detail[1]}/index.html`;

  const staticPaths = ['/gizlilik', '/sartlar', '/iletisim', '/portfoy'];
  if (!target && staticPaths.includes(pathname)) target = `/prerender${pathname}/index.html`;

  if (!target) return;

  return new Response(null, {
    headers: {
      'x-middleware-rewrite': target,
    },
  });
}

export const config = {
  matcher: ['/proje/:path*', '/gizlilik', '/sartlar', '/iletisim', '/portfoy'],
};
