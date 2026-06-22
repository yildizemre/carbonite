export function renderLegalSection(section) {
  const bullets = section.items?.length
    ? `<ul class="legal-list">${section.items.map((item) => `<li>${item}</li>`).join('')}</ul>`
    : '';

  const subsections = section.subsections?.length
    ? section.subsections
        .map(
          (sub) => `
        <div class="legal-subsection">
          ${sub.subheading ? `<h3>${sub.subheading}</h3>` : ''}
          ${sub.paragraphs?.map((p) => `<p>${p}</p>`).join('') || ''}
          ${sub.items?.length ? `<ul class="legal-list">${sub.items.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
        </div>
      `
        )
        .join('')
    : '';

  return `
    <section class="legal-section">
      <h2>${section.heading}</h2>
      ${section.paragraphs?.map((p) => `<p>${p}</p>`).join('') || ''}
      ${bullets}
      ${subsections}
    </section>
  `;
}

export function renderLegalPage(title, sections, options = {}) {
  const { intro = [], introTitle = '', wide = false } = options;
  const containerClass = wide ? 'container--legal' : 'container--narrow';

  return `
    <div class="page page--legal">
      <div class="container ${containerClass}">
        <h1 class="page-title">${title}</h1>
        ${intro.length ? `
          <div class="legal-intro-block">
            ${introTitle ? `<h2 class="legal-intro-title">${introTitle}</h2>` : ''}
            <div class="legal-intro">${intro.map((p) => `<p>${p}</p>`).join('')}</div>
          </div>
        ` : ''}
        <div class="legal-content">
          ${sections.map((section) => renderLegalSection(section)).join('')}
        </div>
      </div>
    </div>
  `;
}
