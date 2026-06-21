/* =========================================================
   GrowWithViren — homepage-data.js
   Renders featured resources and testimonials on the homepage.
   Only items with featured: true appear here (max 3 each).
   Full archives are on resources.html and testimonials.html.
   ========================================================= */

/* ---------- Featured Resources (homepage) ---------- */
async function loadFeaturedResources() {
  const grid = document.getElementById('homeResourcesGrid');
  if (!grid) return;

  try {
    const res  = await fetch('data/resources.json');
    const data = await res.json();

    const featured = data
      .filter(r => r.featured)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    featured.forEach((resource, i) => {
      const article = document.createElement('article');
      article.className = 'resource-card';
      article.setAttribute('data-animate', 'fade-up');
      article.setAttribute('data-animate-delay', String(i * 100));
      article.style.setProperty('--animate-delay', `${i * 100}ms`);

      article.innerHTML = `
        <span class="resource-card__badge">${escHtml(resource.badge)}</span>
        <h3 class="resource-card__title">${escHtml(resource.title)}</h3>
        <p class="resource-card__text">${escHtml(resource.summary)}</p>
        <a href="resources/post.html?id=${encodeURIComponent(resource.id)}" class="resource-card__link">
          Read more <span aria-hidden="true">→</span>
        </a>
      `;

      grid.appendChild(article);

      // Trigger animation once in view
      requestAnimationFrame(() => {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        observer.observe(article);
      });
    });
  } catch (err) {
    console.error('Could not load featured resources:', err);
  }
}

/* ---------- Featured Testimonials (homepage) ---------- */
async function loadFeaturedTestimonials() {
  const grid = document.getElementById('homeTestimonialsGrid');
  if (!grid) return;

  try {
    const res  = await fetch('data/testimonials.json');
    const data = await res.json();

    const featured = data
  .filter(t => t.featured)
  .sort((a, b) => b.id - a.id)
  .slice(0, 3);

    featured.forEach((t, i) => {
      const figure = document.createElement('figure');
      figure.className = 'testimonial-card';
      figure.setAttribute('data-animate', 'fade-up');
      figure.setAttribute('data-animate-delay', String(i * 120));
      figure.style.setProperty('--animate-delay', `${i * 120}ms`);

      figure.innerHTML = `
        <blockquote class="testimonial-card__quote">${escHtml(t.quote)}</blockquote>
        <figcaption class="testimonial-card__author">
          <span class="testimonial-card__avatar" aria-hidden="true">${escHtml(t.initials)}</span>
          <span class="testimonial-card__meta">
            <span class="testimonial-card__name">${escHtml(t.name)}</span>
            <span class="testimonial-card__role">${escHtml(t.role)}</span>
          </span>
        </figcaption>
      `;

      grid.appendChild(figure);

      requestAnimationFrame(() => {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        observer.observe(figure);
      });
    });
  } catch (err) {
    console.error('Could not load featured testimonials:', err);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- Boot both ---------- */
loadFeaturedResources();
loadFeaturedTestimonials();
