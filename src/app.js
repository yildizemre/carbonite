import { renderMarketPage, renderProjectDetailPage, renderPurchasePage, renderPortfolioPage, renderPrivacyPage, renderTermsPage, renderContactPage } from './pages.js';
import { applySeo } from './seo.js';
import { content, getLang, setLang } from './content.js';

function renderLogo(className = 'logo') {
  return `<a class="${className}" href="/" aria-label="Carbonited"><img src="/Carbonited Logo.png" alt="Carbonited" width="148" height="32" /></a>`;
}

function getNavItems(route, lang) {
  const t = content[lang].nav;
  const isMarket = route.page === 'market';

  return [
    { label: t.marketplace, href: isMarket ? '#marketplace' : '/#marketplace' },
    { label: t.why, href: isMarket ? '#why' : '/#why' },
    { label: t.contact, href: isMarket ? '#contact' : '/#contact' },
  ];
}

function renderNav(items, className = '') {
  return `
    <ul class="nav-list ${className}">
      ${items.map((item) => `
        <li class="nav-item${item.active ? ' is-active' : ''}">
          <a href="${item.href}"><span>${item.label}</span></a>
        </li>
      `).join('')}
    </ul>
  `;
}

export function parseRoute() {
  const parts = window.location.pathname.split('/').filter(Boolean);

  if (parts[0] === 'gizlilik') return { page: 'privacy' };
  if (parts[0] === 'sartlar') return { page: 'terms' };
  if (parts[0] === 'iletisim') return { page: 'contact' };
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
    case 'privacy': return renderPrivacyPage();
    case 'terms': return renderTermsPage();
    case 'contact': return renderContactPage();
    default: return renderMarketPage();
  }
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  render();
}

function render() {
  const route = parseRoute();
  const lang = getLang();
  const t = content[lang];
  applySeo(route, lang);
  const navItems = getNavItems(route, lang);

  const app = document.getElementById('app');
  app.innerHTML = `
    <a class="skip-link" href="#main-content">${t.ui.skipLink}</a>
    <div class="site-wrapper">
      <header class="site-header is-scrolled">
        <div class="container header-inner">
          ${renderLogo()}
          <nav class="main-nav" aria-label="${t.ui.mainNav}">${renderNav(navItems)}</nav>
          <div class="header-actions">
            <button type="button" class="lang-toggle" aria-label="${t.ui.switchLang}">${lang === 'tr' ? 'EN' : 'TR'}</button>
            <a class="btn-login" href="https://app.carbonited.com" target="_blank" rel="noopener noreferrer">${t.nav.login}</a>
          </div>
          <button class="menu-toggle" type="button" aria-label="${t.ui.openMenu}" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div class="mobile-nav" hidden>
        <div class="mobile-nav__header">
          ${renderLogo()}
          <button class="menu-close" type="button" aria-label="${t.ui.closeMenu}">×</button>
        </div>
        <nav aria-label="${t.ui.mobileNav}">${renderNav(navItems, 'mobile')}</nav>
        <div class="mobile-nav__actions">
          <button type="button" class="lang-toggle lang-toggle--mobile">${lang === 'tr' ? 'English' : 'Türkçe'}</button>
          <a class="btn-login btn-login--mobile" href="https://app.carbonited.com" target="_blank" rel="noopener noreferrer">${t.nav.login}</a>
        </div>
      </div>
      <div class="site-overlay" hidden></div>

      <main class="site-main" id="main-content">${renderContent(route)}</main>

      <footer class="site-footer">
        <div class="container footer-inner">
          ${renderLogo()}
          <p class="footer-copy">${t.footer.copy}</p>
          <nav class="footer-nav" aria-label="${t.ui.footerNav}">
            <a href="/gizlilik">${t.footer.privacy}</a>
            <a href="/sartlar">${t.footer.terms}</a>
            <a href="/iletisim">${t.footer.contact}</a>
          </nav>
        </div>
      </footer>
    </div>
  `;

  bindInteractions(route);
  if (window.location.hash) scrollToHash(window.location.hash);
  else window.scrollTo(0, 0);
}

let closeMobileMenuFn = null;

export function initPage() {
  window.addEventListener('popstate', render);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;

    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      history.pushState({}, '', href);
      scrollToHash(href);
      closeMobileMenuFn?.();
      return;
    }

    if (href.includes('#') && href.startsWith('/')) {
      const [path, hash] = href.split('#');
      if (path === window.location.pathname || (path === '/' && parseRoute().page === 'market')) {
        e.preventDefault();
        if (path !== window.location.pathname) navigate(path);
        history.pushState({}, '', `#${hash}`);
        scrollToHash(`#${hash}`);
        return;
      }
    }

    if (!href.startsWith('/')) return;
    e.preventDefault();
    navigate(href);
  });

  render();
}

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bindInteractions(route) {
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.site-overlay');

  const closeMobileMenu = () => {
    if (!mobileNav) return;
    mobileNav.hidden = true;
    overlay.hidden = true;
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  closeMobileMenuFn = closeMobileMenu;

  menuToggle?.addEventListener('click', () => {
    mobileNav.hidden = false;
    overlay.hidden = false;
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  });
  menuClose?.addEventListener('click', closeMobileMenu);
  overlay?.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.nav-item.has-children > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(getLang() === 'tr' ? 'en' : 'tr');
      render();
    });
  });

  if (route.page === 'market') bindLandingInteractions();
  bindContactForms(route);

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

function bindLandingInteractions() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#all-projects .search-box input');

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

  document.querySelectorAll('.why-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.why-tab').forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      document.querySelectorAll('.why-panel').forEach((panel) => {
        const show = panel.dataset.panel === target;
        panel.classList.toggle('is-active', show);
        panel.hidden = !show;
      });
    });
  });

  document.querySelector('.home-contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(content[getLang()].ui.formSuccess);
    e.target.reset();
  });
}

function bindContactForms(route) {
  document.querySelector('.page-contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(content[getLang()].contactPage.formSuccess);
    e.target.reset();
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
