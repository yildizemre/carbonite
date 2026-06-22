import { content, getLang } from './content.js';

export function renderLandingPage(lang = getLang()) {
  const t = content[lang];

  const audienceCards = t.audience.cards
    .map(
      (c) => `
    <article class="feature-card">
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </article>
  `
    )
    .join('');

  const buyerCards = t.why.buyers
    .map(
      (c) => `
    <article class="why-card">
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </article>
  `
    )
    .join('');

  const sellerCards = t.why.sellers
    .map(
      (c) => `
    <article class="why-card">
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </article>
  `
    )
    .join('');

  const securityCards = t.security.cards
    .map(
      (c) => `
    <article class="security-card">
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </article>
  `
    )
    .join('');

  const solutionOptions = t.homeContact.solutions
    .map((s) => `<option value="${s}">${s}</option>`)
    .join('');

  const metrics = t.metrics
    .map(
      (m) => `
    <div class="metric-item">
      <span class="metric-item__value">${m.value}</span>
      <span class="metric-item__label">${m.label}</span>
    </div>
  `
    )
    .join('');

  return `
    <div class="landing" data-lang="${lang}">
      <section class="landing-hero" id="hero">
        <div class="container landing-hero__inner">
          <div class="landing-hero__copy">
            <h1>${t.hero.title}</h1>
            <p class="landing-hero__subtitle">${t.hero.subtitle}</p>
            <a class="btn-primary" href="#contact">${t.hero.cta}</a>
          </div>
          <div class="landing-hero__visual">
            <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&h=600&q=80" alt="" loading="eager" />
          </div>
        </div>
      </section>

      <section class="metrics-band" aria-label="${t.ui.metricsAria}">
        <div class="container metrics-band__inner">${metrics}</div>
      </section>

      <section class="landing-section landing-section--soft" id="audience">
        <div class="container">
          <header class="section-header section-header--center">
            <h2>${t.audience.title}</h2>
          </header>
          <div class="audience-grid">${audienceCards}</div>
        </div>
      </section>

      <section class="landing-section" id="why">
        <div class="container">
          <header class="section-header section-header--center">
            <h2>${t.why.title}</h2>
          </header>
          <div class="why-tabs" role="tablist">
            <button type="button" class="why-tab is-active" role="tab" aria-selected="true" data-tab="buyers">${t.why.tabBuyers}</button>
            <button type="button" class="why-tab" role="tab" aria-selected="false" data-tab="sellers">${t.why.tabSellers}</button>
          </div>
          <div class="why-panel is-active" data-panel="buyers" role="tabpanel">
            <p class="why-panel__subtitle">${t.why.buyersSubtitle}</p>
            <div class="why-grid">${buyerCards}</div>
          </div>
          <div class="why-panel" data-panel="sellers" role="tabpanel" hidden>
            <p class="why-panel__subtitle">${t.why.sellersSubtitle}</p>
            <div class="why-grid">${sellerCards}</div>
          </div>
        </div>
      </section>

      <section class="landing-section landing-section--soft" id="dmrv">
        <div class="container dmrv-block">
          <div class="dmrv-block__copy">
            <h2>
              ${t.dmrv.title}
              <span class="info-tip" tabindex="0" aria-label="${t.dmrv.tooltipTitle}">
                ⓘ
                <span class="info-tip__bubble" role="tooltip">
                  <strong>${t.dmrv.tooltipTitle}</strong>
                  <span>${t.dmrv.tooltip}</span>
                </span>
              </span>
            </h2>
            <p>${t.dmrv.subtitle}</p>
            <a class="btn-outline" href="/iletisim">${t.dmrv.cta}</a>
          </div>
          <div class="dmrv-block__visual">
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=500&q=80" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section class="landing-section" id="security">
        <div class="container">
          <header class="section-header section-header--center">
            <h2>${t.security.title}</h2>
          </header>
          <div class="security-grid">${securityCards}</div>
        </div>
      </section>

      <section class="landing-section landing-section--dark" id="api">
        <div class="container api-block">
          <div class="api-block__copy">
            <h2>${t.api.title}</h2>
            <p>${t.api.subtitle}</p>
            <a class="btn-primary btn-primary--light" href="/iletisim">${t.api.cta}</a>
          </div>
          <div class="api-block__code" aria-hidden="true">
            <pre><code>GET /v1/credits
POST /v1/retire
GET /v1/projects</code></pre>
          </div>
        </div>
      </section>

      <section class="landing-section landing-section--soft" id="contact">
        <div class="container container--narrow">
          <header class="section-header section-header--center">
            <h2>${t.homeContact.title}</h2>
          </header>
          <form class="contact-form home-contact-form" novalidate>
            <div class="form-row">
              <label>${t.homeContact.name}<input type="text" name="name" required autocomplete="name" /></label>
              <label>${t.homeContact.email}<input type="email" name="email" required autocomplete="email" /></label>
            </div>
            <label>${t.homeContact.company}<input type="text" name="company" required autocomplete="organization" /></label>
            <label>${t.homeContact.solution}
              <select name="solution" required>
                <option value="" disabled selected>${t.ui.select}</option>
                ${solutionOptions}
              </select>
            </label>
            <label>${t.homeContact.message}<textarea name="message" rows="4"></textarea></label>
            <button type="submit" class="btn-primary">${t.homeContact.submit}</button>
            <p class="form-note text-muted">${t.homeContact.note}</p>
          </form>
        </div>
      </section>
    </div>
  `;
}
