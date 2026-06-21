/* =========================================================
   GrowWithViren — testimonials.js
   Loads testimonials.json, renders cards in batches,
   and handles Load More pagination.

   HOW TO ADD A NEW TESTIMONIAL:
   → Open data/testimonials.json
   → Add a new object: { id, initials, name, role, company, quote, featured }
   → Set featured: true to show on homepage (max 3 featured cards shown there)
   → It will appear automatically on this archive page
   ========================================================= */

const CARDS_PER_PAGE = 9;

let allTestimonials = [];
let currentPage = 0;

const grid        = document.getElementById('testimonialsGrid');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn  = document.getElementById('loadMoreBtn');

async function init() {
  try {
    const res = await fetch('data/testimonials.json');

    allTestimonials = await res.json();

    grid.innerHTML = '';

    currentPage = 0;

    renderNextPage();

  } catch (err) {
    console.error(err);
  }
}

function renderNextPage() {

  const start = currentPage * CARDS_PER_PAGE;
  const batch = allTestimonials.slice(start, start + CARDS_PER_PAGE);

  if (!batch.length) {
    loadMoreWrap.hidden = true;
    return;
  }

  batch.forEach((t) => {
    const card = createCard(t);
    grid.appendChild(card);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.add('is-visible'));
    });
  });

  // Move to next page
  currentPage++;

  // Hide button when no more testimonials exist
  const hasMore =
    currentPage * CARDS_PER_PAGE < allTestimonials.length;

  loadMoreWrap.hidden = !hasMore;
}

function createCard(t) {
  const figure = document.createElement('figure');
  figure.className = 'testimonial-card';
  figure.style.opacity = '1';
figure.style.transform = 'none';
  figure.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  figure.innerHTML = `
    <blockquote class="testimonial-card__quote">${escHtml(t.quote)}</blockquote>
    <figcaption class="testimonial-card__author">
      <span class="testimonial-card__avatar" aria-hidden="true">${escHtml(t.initials)}</span>
      <span class="testimonial-card__meta">
  <span class="testimonial-card__name">
    ${escHtml(t.name)}

    ${
      t.linkedin
      ? `<a href="${t.linkedin}"
            target="_blank"
            rel="noopener noreferrer"
            class="testimonial-linkedin">
            LinkedIn
         </a>`
      : ''
    }

  </span>

  <span class="testimonial-card__role">
    ${escHtml(t.role)}
  </span>
</span>
    </figcaption>
  `;

  return figure;
}

loadMoreBtn.addEventListener('click', () => {
  loadMoreBtn.classList.add('is-loading');
  loadMoreBtn.textContent = 'Loading...';

  setTimeout(() => {
    renderNextPage();
    loadMoreBtn.classList.remove('is-loading');
    loadMoreBtn.textContent = 'Load More Stories';
  }, 300);
});

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
