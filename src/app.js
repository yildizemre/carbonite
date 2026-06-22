import { renderMarketPage, renderProjectDetailPage, renderPurchasePage, renderPortfolioPage } from './pages.js';

function getNavItems(route) {
  const isMarket = route.page === 'market';
  const isPortfolio = route.page === 'portfolio';

  return [
    { label: 'Anasayfa', href: '#/', active: isMarket && !route.sub },
    { label: 'Pazaryeri', href: '#/', active: isMarket },
    {
      label: 'Portföy',
      href: '#/portfoy',
      active: isPortfolio,
      children: [
        { label: 'Karbon Kredilerim', href: '#/portfoy' },
        { label: 'İşlem Geçmişi', href: '#/portfoy' },
        { label: 'Raporlar', href: '#/portfoy' },
      ],
    },
    {
      label: 'Cüzdan',
      href: '#',
      children: [
        { label: 'Bakiye', href: '#' },
        { label: 'İtfa', href: '#' },
        { label: 'Transfer', href: '#' },
      ],
    },
  ];
}

function chevronIcon() {
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderNav(items, className = '') {
  return `
    <ul class="nav-list ${className}">
      ${items.map((item) => `
        <li class="nav-item${item.children ? ' has-children' : ''}${item.active ? ' is-active' : ''}">
          <a href="${item.href}"><span>${item.label}</span>${item.children ? chevronIcon() : ''}</a>
          ${item.children ? `<ul class="sub-menu">${item.children.map((c) => `<li><a href="${c.href}"><span>${c.label}</span></a></li>`).join('')}</ul>` : ''}
        </li>
      `).join('')}
    </ul>
  `;
}

function parseRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'portfoy') return { page: 'portfolio' };
  if (parts[0] === 'proje' && parts[1] && parts[2] === 'satin-al') return { page: 'purchase', id: parts[1] };
  if (parts[0] === 'proje' && parts[1]) return { page: 'detail', id: parts[1] };
  return { page: 'market' };
}

function renderContent(route) {
  switch (route.page) {
    case 'detail': return renderProjectDetailPage(route.id);
    case 'purchase': return renderPurchasePage(route.id);
    case 'portfolio': return renderPortfolioPage();
    default: return renderMarketPage();
  }
}

function getPageTitle(route) {
  switch (route.page) {
    case 'detail': return 'Proje Detayı — Carbonited';
    case 'purchase': return 'Karbon Kredisi Satın Al — Carbonited';
    case 'portfolio': return 'Portföyüm — Carbonited';
    default: return 'Carbonited — Kurumsal Karbon Kredisi Pazaryeri';
  }
}

export function initPage() {
  const render = () => {
    const route = parseRoute();
    document.title = getPageTitle(route);
    const navItems = getNavItems(route);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="site-wrapper">
        <header class="site-header is-scrolled">
          <div class="container header-inner">
            <a class="logo" href="#/">carbonited<span class="logo-dot">•</span></a>
            <nav class="main-nav" aria-label="Ana menü">${renderNav(navItems)}</nav>
            <div class="header-actions">
              <a class="btn-login" href="https://app.carbonited.com" target="_blank" rel="noopener noreferrer">Giriş Yap</a>
            </div>
            <button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </header>

        <div class="mobile-nav" hidden>
          <div class="mobile-nav__header">
            <a class="logo" href="#/">carbonited<span class="logo-dot">•</span></a>
            <button class="menu-close" type="button" aria-label="Menüyü kapat">×</button>
          </div>
          <nav aria-label="Mobil menü">${renderNav(navItems, 'mobile')}</nav>
          <a class="btn-login btn-login--mobile" href="https://app.carbonited.com" target="_blank" rel="noopener noreferrer">Giriş Yap</a>
        </div>
        <div class="site-overlay" hidden></div>

        <main class="site-main">${renderContent(route)}</main>

        <footer class="site-footer">
          <div class="container footer-inner">
            <a class="logo" href="#/">carbonited<span class="logo-dot">•</span></a>
            <p class="footer-copy">© 2026 Carbonited. Tüm hakları saklıdır.</p>
            <nav class="footer-nav" aria-label="Alt menü">
              <a href="#">Gizlilik</a>
              <a href="#">Şartlar</a>
              <a href="#">İletişim</a>
            </nav>
          </div>
        </footer>
      </div>
    `;

    bindInteractions(route);
  };

  window.addEventListener('hashchange', render);
  render();
}

function bindInteractions(route) {
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.site-overlay');

  const closeMenu = () => {
    mobileNav.hidden = true;
    overlay.hidden = true;
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    mobileNav.hidden = false;
    overlay.hidden = false;
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  });
  menuClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-item.has-children > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

  if (route.page === 'market') bindMarketInteractions();

  document.querySelectorAll('.filter-dropdown__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.nextElementSibling;
      const isOpen = menu.classList.contains('is-open');
      document.querySelectorAll('.filter-dropdown__menu').forEach((m) => m.classList.remove('is-open'));
      if (!isOpen) menu.classList.add('is-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
      document.querySelectorAll('.filter-dropdown__menu').forEach((m) => m.classList.remove('is-open'));
    }
  });
}

function bindMarketInteractions() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-box input');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFilters(btn.dataset.filter, searchInput?.value || '');
    });
  });

  searchInput?.addEventListener('input', () => {
    const active = document.querySelector('.filter-btn.is-active')?.dataset.filter || 'all';
    applyFilters(active, searchInput.value);
  });

  document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      const slug = card.dataset.category;
      const filterBtn = document.querySelector(`.filter-btn[data-filter="${slug}"]`);
      if (filterBtn) {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        filterBtn.classList.add('is-active');
        applyFilters(slug, searchInput?.value || '');
        document.querySelector('.projects-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function applyFilters(category, query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.project-card').forEach((card) => {
    const matchCat = category === 'all' || card.dataset.category === category;
    const title = card.querySelector('.project-card__title')?.textContent.toLowerCase() || '';
    card.hidden = !(matchCat && (!q || title.includes(q)));
  });
}
