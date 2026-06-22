import { categories, filters, projects, getProject } from './data.js';

export function renderBreadcrumb(items) {
  return `
    <nav class="breadcrumb" aria-label="Sayfa yolu">
      ${items.map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast) return `<span>${item.label}</span>`;
        return `<a href="${item.href}">${item.label}</a><span class="breadcrumb__sep">›</span>`;
      }).join('')}
    </nav>
  `;
}

export function renderMarketPage() {
  return `
    <section class="hero-section" id="market">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow">Kurumsal Karbon Kredisi Pazaryeri</p>
          <h1>Fiziksel Krediler,<br /><span class="text-accent">Anlık Likidite.</span></h1>
          <p class="hero-desc">
            Carbonited; emisyon dengeleme süreçleri için fiziksel karbon kredilerini tokenize eden,
            saniyeler içinde aracısız takas ve resmi itfa sağlayan kurumsal likidite katmanıdır.
          </p>
        </div>
        <div class="hero-visual">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" alt="Modern kurumsal bina" loading="eager" />
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Sektörlere Göre Karbon Kredisi Platformları</h2>
        <div class="categories-grid">
          ${categories.map((cat) => `
            <button type="button" class="category-card" data-category="${cat.slug}">
              <img src="${cat.image}" alt="${cat.label}" loading="lazy" />
              <span>${cat.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="projects-section">
      <div class="container">
        <h2 class="section-title">Tokenize Karbon Projeleri</h2>
        <div class="projects-toolbar">
          <div class="filter-group" role="group" aria-label="Filtreler">
            ${filters.map((f, i) => `<button type="button" class="filter-btn${i === 0 ? ' is-active' : ''}" data-filter="${f.value}">${f.label}</button>`).join('')}
          </div>
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M13 13L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input type="search" placeholder="Proje ara..." aria-label="Proje ara" />
          </div>
        </div>
        <div class="projects-grid">
          ${projects.map(renderProjectCard).join('')}
        </div>
        <div class="projects-footer">
          <a class="btn-primary" href="#/">Tümünü Gör</a>
        </div>
      </div>
    </section>
  `;
}

function renderProjectCard(project) {
  const marketLabel = project.market === 'primary' ? 'Birincil Piyasa' : 'İkincil Piyasa';
  const marketClass = project.market === 'primary' ? 'badge--primary' : 'badge--secondary';
  return `
    <article class="project-card" data-category="${project.category}">
      <div class="project-card__header">
        <img class="project-card__thumb" src="${project.image}" alt="" loading="lazy" />
        <span class="badge ${marketClass}">${marketLabel}</span>
      </div>
      <h3 class="project-card__title">${project.title}</h3>
      <dl class="project-card__stats">
        <div class="stat"><dt>Toplam Hacim</dt><dd>${project.volume}</dd></div>
        <div class="stat"><dt>Pay Fiyatı</dt><dd>${project.price}</dd></div>
        <div class="stat stat--right"><dt>Token Adedi</dt><dd>${project.tokens}</dd></div>
        <div class="stat stat--right"><dt>Vade Süresi</dt><dd>${project.maturity}</dd></div>
      </dl>
      <a class="project-card__link" href="#/proje/${project.id}">Detayları Gör ›</a>
    </article>
  `;
}

export function renderProjectDetailPage(id) {
  const p = getProject(id);
  const isPrimary = p.market === 'primary';
  const marketLabel = isPrimary ? 'Birincil Piyasa' : 'İkincil Piyasa';

  return `
    <div class="page page--detail">
      <div class="container">
        ${renderBreadcrumb([
          { label: 'Pazaryeri', href: '#/' },
          { label: 'Karbon Projeleri', href: '#/' },
          { label: 'Detay', href: `#/proje/${p.id}` },
        ])}

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
              <a class="btn-primary" href="#/proje/${p.id}/satin-al">Karbon Kredisi Satın Al</a>
            </div>

            <section class="detail-block">
              <h2>Proje Hakkında</h2>
              <div class="detail-about">
                <p><strong>Proje Geliştiricisi:</strong> ${p.developer}</p>
                <p><strong>Doğrulayıcı Kurum:</strong> ${p.verifier}</p>
                <p><strong>BM Kalkınma Amaçları (SDG):</strong> ${p.sdgs}</p>
                <p>${p.description}</p>
              </div>
            </section>

            <section class="detail-block">
              <h2>Proje ve Token Detayları</h2>
              <dl class="detail-table">
                <div class="detail-row"><dt>Toplam Kredi (Ton CO2e)</dt><dd>${p.supply}</dd></div>
                <div class="detail-row"><dt>Sertifika Yılı (Vintage)</dt><dd>${p.vintage}</dd></div>
                <div class="detail-row"><dt>Proje Standardı / Registry</dt><dd><a href="#" class="link-teal">${p.registry}</a></dd></div>
                <div class="detail-row"><dt>Akıllı Kontrat Adresi</dt><dd><a href="#" class="link-teal mono">${p.contractAddress}</a></dd></div>
                <div class="detail-row"><dt>İşlem Hash'i</dt><dd><a href="#" class="link-teal mono">${p.txHash}</a></dd></div>
                <div class="detail-row"><dt>Proje Metodolojisi</dt><dd>${p.methodology}</dd></div>
                <div class="detail-row"><dt>Proje Tipi ve Sektörü</dt><dd>${p.projectType}</dd></div>
              </dl>
            </section>

            <section class="detail-block">
              <h2>Proje Belgeleri ve Raporlar</h2>
              <ul class="doc-list">
                <li><a href="#" class="doc-item">📄 Proje Tasarım Belgesi (PDD).pdf</a></li>
                <li><a href="#" class="doc-item">📄 Doğrulama Raporu.pdf</a></li>
                <li><a href="#" class="doc-item">📄 İzleme Raporu.pdf</a></li>
              </ul>
            </section>
          </div>

          <aside class="detail-sidebar">
            <div class="sidebar-card">
              <h3>${isPrimary ? 'Birincil Piyasa' : 'İkincil Piyasa'}</h3>
              ${isPrimary ? `
                <dl class="sidebar-stats">
                  <div><dt>Toplam Hacim</dt><dd>${p.volume}</dd></div>
                  <div><dt>Token Fiyatı</dt><dd>${p.price}</dd></div>
                  <div><dt>Sertifika Yılı</dt><dd>${p.vintage}</dd></div>
                </dl>
                <p class="sidebar-note">Son oluşturulan tokenize varlıklarını görüntüleyebilirsiniz.</p>
                <a class="btn-primary btn-full" href="#/proje/${p.id}/satin-al">Karbon Kredisi Satın Al</a>
              ` : `
                <dl class="sidebar-stats">
                  <div><dt>Doğrulanmış Satıcı Adresi</dt><dd class="mono">${p.sellerAddress}</dd></div>
                  <div><dt>Token Adedi (Ton)</dt><dd>${p.supply}</dd></div>
                  <div><dt>Token Fiyatı</dt><dd>${p.price}</dd></div>
                </dl>
                <p class="sidebar-note">Kullanıcılar tarafından satışa sunulan karbon kredilerini görüntüleyebilirsiniz.</p>
                <a class="btn-primary btn-full" href="#/proje/${p.id}/satin-al">Karbon Kredisi Satın Al</a>
              `}
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

export function renderPurchasePage(id) {
  const p = getProject(id);
  return `
    <div class="page page--purchase">
      <div class="container">
        ${renderBreadcrumb([
          { label: 'Pazaryeri', href: '#/' },
          { label: 'Karbon Projeleri', href: '#/' },
          { label: 'Satın Al', href: `#/proje/${p.id}/satin-al` },
        ])}

        <div class="purchase-header">
          <h1>Karbon Kredisi Satın Al</h1>
          <button type="button" class="btn-primary">İşlemi Onayla</button>
        </div>

        <div class="purchase-card">
          <img src="${p.image}" alt="" />
          <div class="purchase-card__info">
            <span class="purchase-card__label">Proje Adı</span>
            <strong>${p.title}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">Mevcut Arz (Ton CO2e)</span>
            <strong>${p.supply}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">Toplam Hacim</span>
            <strong>${p.volume}</strong>
          </div>
          <div class="purchase-card__info">
            <span class="purchase-card__label">Sertifika Yılı (Vintage)</span>
            <strong>${p.vintage}</strong>
          </div>
        </div>

        <div class="purchase-layout">
          <div class="purchase-main">
            <section class="detail-block">
              <h2>Satın Alma Koşulları</h2>
              <p class="text-muted">Bu proje kapsamında tokenize edilmiş karbon kredileri, belirlenen minimum ve maksimum alım limitleri dahilinde satın alınabilir. Tüm işlemler blockchain üzerinde doğrulanır.</p>
            </section>

            <div class="swap-box">
              <div class="swap-field">
                <label>Ödenecek Tutar</label>
                <div class="swap-input"><span>₺</span><input type="text" value="80.000" /></div>
              </div>
              <div class="swap-arrow">⇅</div>
              <div class="swap-field">
                <label>Alınacak Miktar (Ton CO2e)</label>
                <div class="swap-input"><span>tCO2e</span><input type="text" value="100" /></div>
              </div>
            </div>

            <dl class="detail-table">
              <div class="detail-row"><dt>Sertifika Talebi İçin Min. Alım</dt><dd>${p.minCertificate}</dd></div>
              <div class="detail-row"><dt>Minimum Alım Miktarı</dt><dd>${p.minPurchase}</dd></div>
              <div class="detail-row"><dt>Maksimum Alım Miktarı</dt><dd>${p.maxPurchase}</dd></div>
            </dl>
          </div>

          <aside class="purchase-sidebar">
            <div class="sidebar-card">
              <h3>Cüzdan Detayı</h3>
              <div class="wallet-info">
                <span class="wallet-icon">Ξ</span>
                <div>
                  <strong>27.34 ETH</strong>
                  <span class="text-muted">≈ $45,230 USD</span>
                </div>
              </div>
            </div>

            <div class="sidebar-card">
              <h3>İşlem Özeti</h3>
              <dl class="summary-list">
                <div><dt>Toplam Tutar</dt><dd>₺80.000</dd></div>
                <div><dt>Birim Fiyat</dt><dd>${p.price}</dd></div>
                <div><dt>Token Adedi</dt><dd>100 tCO2e</dd></div>
                <div><dt>Minimum Alım (Ton)</dt><dd>${p.minPurchase}</dd></div>
                <div><dt>Maksimum Alım (Ton)</dt><dd>${p.maxPurchase}</dd></div>
                <div><dt>Sertifika İçin Min. Kredi</dt><dd>${p.minCertificate}</dd></div>
                <div><dt>Kur Oranı</dt><dd>${p.exchangeRate}</dd></div>
                <div><dt>Platform İşlem Ücreti</dt><dd>${p.platformFee}</dd></div>
                <div><dt>Altyapı Ücreti</dt><dd>${p.infraFee}</dd></div>
              </dl>
              <button type="button" class="btn-primary btn-full">Krediyi Satın Al</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

export function renderPortfolioPage() {
  return `
    <div class="page page--portfolio">
      <div class="container">
        ${renderBreadcrumb([
          { label: 'Portföy', href: '#/portfoy' },
          { label: 'Karbon Kredilerim', href: '#/portfoy' },
        ])}

        <h1 class="page-title">Portföyüm</h1>

        <div class="portfolio-toolbar">
          <div class="filter-dropdowns">
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">Proje Kategorisi ▾</button>
              <ul class="filter-dropdown__menu">
                <li><button type="button">Doğa Temelli</button></li>
                <li><button type="button">Yenilenebilir Enerji</button></li>
                <li><button type="button">Atık Yönetimi</button></li>
                <li><button type="button">Mavi Karbon</button></li>
              </ul>
            </div>
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">Sertifika Yılı ▾</button>
              <ul class="filter-dropdown__menu">
                <li><button type="button">2022</button></li>
                <li><button type="button">2023</button></li>
                <li><button type="button">2024</button></li>
                <li><button type="button">2025</button></li>
              </ul>
            </div>
            <div class="filter-dropdown">
              <button type="button" class="filter-dropdown__btn">Kredi Durumu ▾</button>
              <ul class="filter-dropdown__menu">
                <li><button type="button">Cüzdanda (Satılabilir)</button></li>
                <li><button type="button">Pazaryerinde Satışta</button></li>
              </ul>
            </div>
          </div>
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M13 13L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input type="search" placeholder="Ara" aria-label="Ara" />
          </div>
        </div>

        <div class="empty-state">
          <p>Portföyünüzde henüz karbon kredisi bulunmuyor.</p>
          <a class="btn-primary" href="#/">Pazaryerine Git</a>
        </div>
      </div>
    </div>
  `;
}
