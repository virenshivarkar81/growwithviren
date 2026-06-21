/* =========================================================
   GrowWithViren — post.js
   Reads ?id= from the URL query string, loads resources.json,
   finds the matching post, and renders the full Q&A content.

   HOW TO LINK TO A POST:
   resources/post.html?id=qa-interview-questions
   The id matches the "id" field in data/resources.json.
   ========================================================= */

const loadingEl = document.getElementById('postLoading');
const errorEl   = document.getElementById('postError');
const contentEl = document.getElementById('postContent');

async function loadPost() {
  /* Get the post ID from the URL query string */
  const params = new URLSearchParams(window.location.search);
  const postId  = params.get('id');

  if (!postId) {
    showError();
    return;
  }

  try {
    /* The post.html file lives in /resources/, so we go up one level */
    const res  = await fetch('../data/resources.json');
    const data = await res.json();

    const post = data.find(r => r.id === postId);

    if (!post) {
      showError();
      return;
    }

    /* Update page <title> and meta */
    document.title = `${post.title} | GrowWithViren`;
    document.getElementById('canonicalUrl').href =
    window.location.href;

document.getElementById('keywordsMeta').setAttribute(
    'content',
    `${post.badge}, ${post.title}, Interview Questions, Career Growth, GrowWithViren`
);

document.querySelector(
    'meta[property="og:url"]'
).setAttribute(
    'content',
    window.location.href
);
    document.querySelector('meta[name="description"]').setAttribute('content', post.summary);
    document.querySelector('meta[property="og:title"]').setAttribute('content', `${post.title} | GrowWithViren`);
    document.querySelector('meta[property="og:description"]').setAttribute('content', post.summary);

    /* Populate post header */
    document.getElementById('postBadge').textContent    = post.badge;
    document.getElementById(
  'breadcrumbCategory'
).textContent = post.badge;
    document.getElementById('postDate').textContent     = formatDate(post.date);
    document.getElementById('postReadTime').textContent = post.readTime;
    document.getElementById('postTitle').textContent    = post.title;
    document.getElementById('postSummary').textContent  = post.summary;

    /* Render Q&A items */
    const postBody = document.getElementById('postBody');
    const tocList = document.getElementById('tocList');
   post.content.forEach((item,index) => {

  const sectionId = `section-${index}`;

  const div = document.createElement('div');

const hasAnswer =
  item.body &&
  item.body.trim() !== '';

div.className = hasAnswer
  ? 'qa-item'
  : 'qa-item no-answer';

div.id = sectionId;

div.innerHTML = `
  <h2 class="qa-question">${escHtml(item.heading)}</h2>

  ${
    hasAnswer
      ? `
        <p class="qa-answer">
          ${escHtml(item.body)}
        </p>
      `
      : ''
  }

  ${
    item.code &&
    item.code.trim() !== '' &&
    item.code !== 'nan'
      ? `<pre class="qa-code"><code>${
  escHtml(item.code)
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '    ')
}</code></pre>`
      : ''
  }
`;

  postBody.appendChild(div);

  const tocItem = document.createElement('li');

  tocItem.innerHTML = `
    <a href="#${sectionId}">
      ${escHtml(item.heading)}
    </a>
  `;

  tocList.appendChild(tocItem);

});

    /* Related posts (up to 5 others) */
    const related = data.filter(r => r.id !== postId).slice(0, 5);
    const relatedList = document.getElementById('relatedList');
    related.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="post.html?id=${encodeURIComponent(r.id)}">${escHtml(r.title)}</a>`;
      relatedList.appendChild(li);
    });

    /* Show content */
/* Show content */
loadingEl.hidden = true;
loadingEl.style.display = "none";

contentEl.hidden = false;
contentEl.style.display = "block";

  } catch (err) {
    console.error('Failed to load post:', err);
    showError();
  }
}

function showError() {
  loadingEl.hidden = true;
  errorEl.hidden   = false;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

loadPost();


document.addEventListener('DOMContentLoaded', () => {

  const linkedInBtn =
    document.getElementById('shareLinkedIn');

  const whatsappBtn =
    document.getElementById('shareWhatsApp');

  const copyBtn =
    document.getElementById('copyLink');

  if (linkedInBtn) {

    linkedInBtn.addEventListener('click', () => {

      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );

    });

  }

  if (whatsappBtn) {

    whatsappBtn.addEventListener('click', () => {

      window.open(
        `https://wa.me/?text=${encodeURIComponent(document.title + ' ' + window.location.href)}`,
        '_blank'
      );

    });

  }

  if (copyBtn) {

    copyBtn.addEventListener('click', async () => {

      await navigator.clipboard.writeText(
        window.location.href
      );

      copyBtn.textContent = 'Copied!';

      setTimeout(() => {
        copyBtn.textContent = 'Copy Link';
      }, 2000);

    });

  }

});
