export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const isBot = /(bot|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|googlebot|bingbot|preview)/i.test(ua);
  if (!isBot) return;

  const { pathname } = new URL(request.url);
  const staticPaths = ['/gizlilik', '/sartlar', '/iletisim'];
  if (!staticPaths.includes(pathname)) return;

  return new Response(null, {
    headers: {
      'x-middleware-rewrite': `/prerender${pathname}/index.html`,
    },
  });
}

export const config = {
  matcher: ['/gizlilik', '/sartlar', '/iletisim'],
};
