/* =========================================================
   GrowWithViren — resources.js
   Loads resources.json, builds filter buttons, renders cards,
   and handles Load More pagination.

   HOW TO ADD A NEW RESOURCE:
   → Open data/resources.json
   → Add a new object to the array with: id, title, badge, summary,
     date, readTime, featured, and content (array of heading+body)
   → That's it. The card and post page appear automatically.
   ========================================================= */

const CARDS_PER_PAGE = 9;

let allResources = [];
let filteredResources = [];
let currentPage = 0;
let activeFilter = 'all';

const grid = document.getElementById('resourcesGrid');
const filterBar = document.getElementById('filterBar');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('resourceSearch');

/* ---------- Fetch data ---------- */
async function init() {
  try {
    const res = await fetch('data/resources.json');
    allResources = await res.json();

    // Sort by date descending (newest first)
    allResources.sort((a, b) => new Date(b.date) - new Date(a.date));

    buildFilters();
    applyFilter('all');
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--ink-muted)">Could not load resources. Please try again later.</p>';
    console.error('Failed to load resources:', err);
  }
}
/*
if (searchInput) {

  searchInput.addEventListener('input', (e) => {

    const keyword = e.target.value.toLowerCase();

    filteredResources = allResources.filter(resource => {

      const matchesSearch =
        resource.title.toLowerCase().includes(keyword) ||
        resource.summary.toLowerCase().includes(keyword) ||
        resource.badge.toLowerCase().includes(keyword);

      const matchesFilter =
        activeFilter === 'all' ||
        resource.badge === activeFilter;

      return matchesSearch && matchesFilter;
    });

    currentPage = 0;
    grid.innerHTML = '';

    if (filteredResources.length) {
      renderNextPage();
      emptyState.hidden = true;
    } else {
      emptyState.hidden = false;
      loadMoreWrap.hidden = true;
    }

  });

} */


  if (searchInput) {

searchInput.addEventListener('input', (e) => {

const keyword = e.target.value.toLowerCase().trim();

currentPage = 0;
grid.innerHTML = '';

if (keyword !== '') {

  // Search across ALL resources
  filteredResources = allResources.filter(resource => {

    return (
      resource.title.toLowerCase().includes(keyword) ||
      resource.summary.toLowerCase().includes(keyword) ||
      resource.badge.toLowerCase().includes(keyword)
    );

  });

} else {

  // When search is cleared, go back to selected filter
  filteredResources = activeFilter === 'all'
    ? allResources
    : allResources.filter(r =>
        r.badge
          .split(',')
          .map(b => b.trim())
          .includes(activeFilter)
      );

}

if (filteredResources.length > 0) {
  renderNextPage();
  emptyState.hidden = true;
} else {
  emptyState.hidden = false;
  loadMoreWrap.hidden = true;
}


});

}


/* ---------- Build filter buttons from unique badges ---------- */
function buildFilters() {
const badges = [...new Set(
    allResources.flatMap(r =>
        r.badge.split(',').map(b => b.trim())
    )
)];
  badges.forEach(badge => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', badge);
    btn.textContent = badge;
    btn.addEventListener('click', () => applyFilter(badge));
    filterBar.appendChild(btn);
  });

  // Wire up the "All" button (already in HTML)
  filterBar.querySelector('[data-filter="all"]').addEventListener('click', () => applyFilter('all'));
}

/* ---------- Apply a filter and reset pagination ---------- */
function applyFilter(filter) {
  activeFilter = filter;
  currentPage = 0;
  grid.innerHTML = '';

  // Update active button state
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.getAttribute('data-filter') === filter);
  });

filteredResources = filter === 'all'
    ? allResources
    : allResources.filter(r =>
        r.badge
            .split(',')
            .map(b => b.trim())
            .includes(filter)
      );

  emptyState.hidden = filteredResources.length > 0;

  if (filteredResources.length > 0) {
    renderNextPage();
  }
}

/* ---------- Render the next batch of cards ---------- */
function renderNextPage() {
  const start = currentPage * CARDS_PER_PAGE;
  const batch = filteredResources.slice(start, start + CARDS_PER_PAGE);

  batch.forEach((resource, i) => {
    const card = createCard(resource, i);
    grid.appendChild(card);

    // Stagger entrance animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.add('is-visible'));
    });
  });

  currentPage++;

  const hasMore = currentPage * CARDS_PER_PAGE < filteredResources.length;
  loadMoreWrap.hidden = !hasMore;
}

/* ---------- Create a resource card element ---------- */
function createCard(resource) {
  const article = document.createElement('article');
  article.className = 'resource-card';
  article.setAttribute('data-animate', 'fade-up');
article.style.opacity = '0';
article.style.transform = 'translateY(20px)';
  article.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  article.innerHTML = `
    <div class="resource-card__badges">
  ${resource.badge
      .split(',')
      .map(b =>
        `<span class="resource-card__badge">${escHtml(b.trim())}</span>`
      )
      .join('')}
</div>
    <h2 class="resource-card__title">${escHtml(resource.title)}</h2>
    <p class="resource-card__text">${escHtml(resource.summary)}</p>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:16px;">
      <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-faint)">${formatDate(resource.date)} · ${escHtml(resource.readTime)}</span>
      <a href="resources/post.html?id=${encodeURIComponent(resource.id)}" class="resource-card__link">
        Read more <span aria-hidden="true">→</span>
      </a>
    </div>
  `;

  // Make the whole card clickable
  article.style.cursor = 'pointer';
  article.addEventListener('click', (e) => {
    if (!e.target.closest('a')) {
      window.location.href = `resources/post.html?id=${encodeURIComponent(resource.id)}`;
    }
  });

  return article;
}

/* ---------- Load More button ---------- */
loadMoreBtn.addEventListener('click', () => {
  loadMoreBtn.classList.add('is-loading');
  loadMoreBtn.textContent = 'Loading...';

  // Small delay for perceived loading (remove if fetching from real API)
  setTimeout(() => {
    renderNextPage();
    loadMoreBtn.classList.remove('is-loading');
    loadMoreBtn.textContent = 'Load More Resources';
  }, 300);
});

/* ---------- Helpers ---------- */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---------- Boot ---------- */
init();
