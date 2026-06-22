import { getProject } from './data.js';
import { renderLandingPage } from './landing.js';
import { content, getLang } from './content.js';
import { aboutContent } from './about-content.js';
import { privacyContent } from './privacy-content.js';
import { termsContent } from './terms-content.js';
import { ethicsContent } from './ethics-content.js';
import { renderLegalPage } from './legal-render.js';

export function renderBreadcrumb(items, lang = getLang()) {
  const t = content[lang].ui;
  return `
    <nav class="breadcrumb" aria-label="${t.breadcrumb}">
      ${items.map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast) return `<span>${item.label}</span>`;
        return `<a href="${item.href}">${item.label}</a><span class="breadcrumb__sep">›</span>`;
      }).join('')}
    </nav>
  `;
}

export function renderMarketPage() {
  return renderLandingPage();
}

export function renderProjectDetailPage(id) {
  const lang = getLang();
  const t = content[lang];
  const c = t.common;
  const d = t.detail;
  const p = getProject(id, lang);
  const isPrimary = p.market === 'primary';
  const marketLabel = isPrimary ? c.primaryMarket : c.secondaryMarket;

  return `
    <div class="page page--detail">
      <div class="container">
        ${renderBreadcrumb([
          { label: c.marketplace, href: '/' },
          { label: c.projects, href: '/' },
          { label: c.detail, href: `/proje/${p.id}` },
        ], lang)}

        <div class="detail-layout">
          <div class="detail-main">
            <div class="detail-hero">
              <img src="${p.heroImage}" alt="${p.title}" />
            </div>

            <div class="detail-header">
              <div>
                <span class="badge ${isPrimary ? 'badge--primary' : 'badge--secondary'}">${marketLabel}</span>
                <h1>${p.title}</h1>
              </div>
              <a class="btn-primary" href="/proje/${p.id}/satin-al">${c.buyCredits}</a>
            </div>

            <section class="detail-block">
              <h2>${d.about}</h2>
              <div class="detail-about">
                <p><strong>${d.developer}:</strong> ${p.developer}</p>
                <p><strong>${d.verifier}:</strong> ${p.verifier}</p>
                <p><strong>${d.sdgs}:</strong> ${p.sdgs}</p>
                <p>${p.description}</p>
              </div>
            </section>

            <section class="detail-block">
              <h2>${d.tokenDetails}</h2>
              <dl class="detail-table">
                <div class="detail-row"><dt>${d.totalCredits}</dt><dd>${p.supply}</dd></div>
                <div class="detail-row"><dt>${d.vintage}</dt><dd>${p.vintage}</dd></div>
                <div class="detail-row"><dt>${d.registry}</dt><dd><a href="#" class="link-teal">${p.registry}</a></dd></div>
                <div class="detail-row"><dt>${d.contract}</dt><dd><a href="#" class="link-teal mono">${p.contractAddress}</a></dd></div>
                <div class="detail-row"><dt>${d.txHash}</dt><dd><a href="#" class="link-teal mono">${p.txHash}</a></dd></div>
                <div class="detail-row"><dt>${d.methodology}</dt><dd>${p.methodology}</dd></div>
                <div class="detail-row"><dt>${d.projectType}</dt><dd>${p.projectType}</dd></div>
              </dl>
            </section>

            <section class="detail-block">
              <h2>${d.documents}</h2>
              <ul class="doc-list">
                ${d.docs.map((doc) => `<li><a href="#" class="doc-item">📄 ${doc}</a></li>`).join('')}
              </ul>
            </section>
          </div>

          <aside class="detail-sidebar">
            <div class="sidebar-card">
              <h3>${marketLabel}</h3>
              ${isPrimary ? `
                <dl class="sidebar-stats">
                  <div><dt>${c.totalVolume}</dt><dd>${p.volume}</dd></div>
                  <div><dt>${c.tokenPrice}</dt><dd>${p.price}</dd></div>
                  <div><dt>${c.vintage}</dt><dd>${p.vintage}</dd></div>
                </dl>
                <p class="sidebar-note">${d.sidebarPrimaryNote}</p>
                <a class="btn-primary btn-full" href="/proje/${p.id}/satin-al">${c.buyCredits}</a>
              ` : `
                <dl class="sidebar-stats">
                  <div><dt>${d.verifiedSeller}</dt><dd class="mono">${p.sellerAddress}</dd></div>
                  <div><dt>${d.tokenTons}</dt><dd>${p.supply}</dd></div>
                  <div><dt>${c.tokenPrice}</dt><dd>${p.price}</dd></div>
                </dl>
                <p class="sidebar-note">${d.sidebarSecondaryNote}</p>
                <a class="btn-primary btn-full" href="/proje/${p.id}/satin-al">${c.buyCredits}</a>
              `}
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

export function renderPurchasePage(id) {
  const lang = getLang();
  const t = content[lang];
  const c = t.common;
  const pu = t.purchase;
  const p = getProject(id, lang);

  return `
    <div class="page page--purchase">
      <div class="container">
        ${renderBreadcrumb([
          { label: c.marketplace, href: '/' },
          { label: c.projects, href: '/' },
          { label: c.purchase, href: `/proje/${p.id}/satin-al` },
        ], lang)}

        <div class="purchase-header">
          <h1>${pu.title}</h1>
          <button type="button" class="btn-primary">${pu.confirm}</button>
        </div>

        <div class="purchase-card">
          <img src="${p.image}" alt="" />
          <div class="purchase-card__info">
            <span class="purchase-card__label">${pu.projectName}</span>
            <strong>${p.title}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">${pu.supply}</span>
            <strong>${p.supply}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">${c.totalVolume}</span>
            <strong>${p.volume}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">${t.detail.vintage}</span>
            <strong>${p.vintage}</strong>
          </div>
        </div>

        <div class="purchase-layout">
          <div class="purchase-main">
            <section class="detail-block">
              <h2>${pu.conditions}</h2>
              <p class="text-muted">${pu.conditionsText}</p>
            </section>

            <div class="swap-box">
              <div class="swap-field">
                <label>${pu.payAmount}</label>
                <div class="swap-input"><span>₺</span><input type="text" value="80.000" /></div>
              </div>
              <div class="swap-arrow">⇅</div>
              <div class="swap-field">
                <label>${pu.receiveAmount}</label>
                <div class="swap-input"><span>tCO2e</span><input type="text" value="100" /></div>
              </div>
            </div>

            <dl class="detail-table">
              <div class="detail-row"><dt>${pu.minCertPurchase}</dt><dd>${p.minCertificate}</dd></div>
              <div class="detail-row"><dt>${pu.minPurchase}</dt><dd>${p.minPurchase}</dd></div>
              <div class="detail-row"><dt>${pu.maxPurchase}</dt><dd>${p.maxPurchase}</dd></div>
            </dl>
          </div>

          <aside class="purchase-sidebar">
            <div class="sidebar-card">
              <h3>${pu.wallet}</h3>
              <div class="wallet-info">
                <span class="wallet-icon">Ξ</span>
                <div>
                  <strong>27.34 ETH</strong>
                  <span class="text-muted">≈ $45,230 USD</span>
                </div>
              </div>
            </div>

            <div class="sidebar-card">
              <h3>${pu.summary}</h3>
              <dl class="summary-list">
                <div><dt>${pu.total}</dt><dd>₺80.000</dd></div>
                <div><dt>${pu.unitPrice}</dt><dd>${p.price}</dd></div>
                <div><dt>${c.tokenCount}</dt><dd>100 tCO2e</dd></div>
                <div><dt>${pu.minPurchaseTon}</dt><dd>${p.minPurchase}</dd></div>
                <div><dt>${pu.maxPurchaseTon}</dt><dd>${p.maxPurchase}</dd></div>
                <div><dt>${pu.minCertCredit}</dt><dd>${p.minCertificate}</dd></div>
                <div><dt>${pu.exchangeRate}</dt><dd>${p.exchangeRate}</dd></div>
                <div><dt>${pu.platformFee}</dt><dd>${p.platformFee}</dd></div>
                <div><dt>${pu.infraFee}</dt><dd>${p.infraFee}</dd></div>
              </dl>
              <button type="button" class="btn-primary btn-full">${pu.buyBtn}</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}


export function renderPortfolioPage() {
  const lang = getLang();
  const t = content[lang];
  const c = t.common;
  const pf = t.portfolio;

  return `
    <div class="page page--portfolio">
      <div class="container">
        ${renderBreadcrumb([
          { label: c.portfolio, href: '/portfoy' },
          { label: c.myCredits, href: '/portfoy' },
        ], lang)}

        <h1 class="page-title">${pf.title}</h1>

        <div class="portfolio-toolbar">
          <div class="filter-dropdowns">
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">${pf.categoryFilter} ▾</button>
              <ul class="filter-dropdown__menu">
                ${pf.categories.map((cat) => `<li><button type="button">${cat}</button></li>`).join('')}
              </ul>
            </div>
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">${pf.vintageFilter} ▾</button>
              <ul class="filter-dropdown__menu">
                <li><button type="button">2022</button></li>
                <li><button type="button">2023</button></li>
                <li><button type="button">2024</button></li>
                <li><button type="button">2025</button></li>
              </ul>
            </div>
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">${pf.statusFilter} ▾</button>
              <ul class="filter-dropdown__menu">
                ${pf.statuses.map((s) => `<li><button type="button">${s}</button></li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M13 13L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input type="search" placeholder="${pf.search}" aria-label="${pf.search}" />
          </div>
        </div>

        <div class="empty-state">
          <p>${pf.empty}</p>
          <a class="btn-primary" href="/">${c.goToMarketplace}</a>
        </div>
      </div>
    </div>
  `;
}

export function renderPrivacyPage() {
  const lang = getLang();
  const { title, intro = [], sections } = privacyContent[lang];
  return renderLegalPage(title, sections, { intro, wide: true });
}

export function renderTermsPage() {
  const lang = getLang();
  const { title, intro = [], sections } = termsContent[lang];
  return renderLegalPage(title, sections, { intro, wide: true });
}

export function renderEthicsPage() {
  const lang = getLang();
  const { title, introTitle, intro = [], sections } = ethicsContent[lang];
  return renderLegalPage(title, sections, { intro, introTitle, wide: true });
}

export function renderAboutPage() {
  const lang = getLang();
  const a = aboutContent[lang];

  const founderCards = a.founders
    .map(
      (f) => `
    <article class="founder-card${f.image ? ' founder-card--with-photo' : ''}">
      ${f.image ? `<div class="founder-card__media"><img class="founder-card__photo" src="${f.image}" alt="${f.name}" width="200" height="200" loading="lazy" /></div>` : ''}
      <div class="founder-card__body">
        <h3>${f.name}</h3>
        <p class="founder-card__role">${f.role}</p>
        <p class="founder-card__subtitle">${f.subtitle}</p>
        <p class="founder-card__bio">${f.bio}</p>
      </div>
    </article>
  `
    )
    .join('');

  const pillars = a.pillars
    .map(
      (p, i) => `
    <section class="about-pillar">
      <h3><span class="about-pillar__num">${i + 1}</span> ${p.title}</h3>
      <p>${p.intro}</p>
      <ul>${p.items.map((item) => `<li>${item}</li>`).join('')}</ul>
    </section>
  `
    )
    .join('');

  return `
    <div class="page page--about">
      <div class="container container--legal">
        <header class="about-hero">
          <h1 class="page-title">${a.title}</h1>
          ${a.intro.map((p) => `<p class="about-lead">${p}</p>`).join('')}
        </header>

        <section class="about-section">
          <h2>${a.foundersTitle}</h2>
          <div class="founders-grid">${founderCards}</div>
        </section>

        <section class="about-section">
          <h2>${a.visionTitle}</h2>
          <p>${a.vision}</p>
        </section>

        <section class="about-section">
          <h2>${a.ecosystemTitle}</h2>
          <p>${a.ecosystemIntro}</p>
          ${pillars}
        </section>

        <section class="about-section">
          <h2>${a.futureTitle}</h2>
          <p>${a.futureText}</p>
          <blockquote class="about-quote">${a.quote}</blockquote>
        </section>

        <section class="about-section about-section--highlight">
          <h2>${a.financeTitle}</h2>
          <p>${a.financeIntro}</p>
          <h3>${a.financeMechanismTitle}</h3>
          <ul class="about-list">${a.financeItems.map((item) => `<li>${item}</li>`).join('')}</ul>
          <h3>${a.financeClosingTitle}</h3>
          <p>${a.financeClosing}</p>
        </section>
      </div>
    </div>
  `;
}

export function renderContactPage() {
  const lang = getLang();
  const cp = content[lang].contactPage;

  return `
    <div class="page page--legal">
      <div class="container container--narrow">
        <h1 class="page-title">${cp.title}</h1>
        <p class="legal-intro">${cp.intro}</p>

        <div class="contact-grid">
          <section class="contact-card">
            <h2>${cp.general}</h2>
            <p><a href="mailto:contact@carbonited.com">contact@carbonited.com</a></p>
            <p class="text-muted">${cp.hours}</p>
          </section>

          <section class="contact-card">
            <h2>${cp.enterprise}</h2>
            <p><a href="mailto:enterprise@carbonited.com">enterprise@carbonited.com</a></p>
            <p class="text-muted">${cp.enterpriseDesc}</p>
          </section>

          <section class="contact-card">
            <h2>${cp.projects}</h2>
            <p><a href="mailto:projects@carbonited.com">projects@carbonited.com</a></p>
            <p class="text-muted">${cp.projectsDesc}</p>
          </section>

          <section class="contact-card">
            <h2>${cp.platform}</h2>
            <p>${cp.platformDesc}</p>
            <a class="btn-primary" href="https://app.carbonited.com" target="_blank" rel="noopener noreferrer">app.carbonited.com</a>
          </section>
        </div>

        <form class="contact-form page-contact-form" novalidate>
          <h2>${cp.formTitle}</h2>
          <div class="form-row">
            <label>
              ${cp.name}
              <input type="text" name="name" placeholder="${cp.namePlaceholder}" required />
            </label>
            <label>
              ${cp.email}
              <input type="email" name="email" placeholder="${cp.emailPlaceholder}" required />
            </label>
          </div>
          <label>
            ${cp.subject}
            <select name="subject">
              ${cp.subjects.map((s) => `<option>${s}</option>`).join('')}
            </select>
          </label>
          <label>
            ${cp.message}
            <textarea name="message" rows="5" placeholder="${cp.messagePlaceholder}" required></textarea>
          </label>
          <button type="submit" class="btn-primary">${cp.submit}</button>
          <p class="form-note text-muted">${cp.note}</p>
        </form>
      </div>
    </div>
  `;
}
