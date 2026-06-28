/* =============================================
   KnowledgeVerse — Offline Search Engine
   ============================================= */
(function (global) {
  'use strict';

  /* Detect site root the same way app.js does — works on GitHub Pages subdirs */
  const BASE = (function () {
    const s = document.querySelector('script[src*="search.js"]');
    if (s && s.src) return s.src.replace(/assets\/js\/search\.js(\?.*)?$/, '');
    const segs = window.location.pathname.replace(/\/[^/]*$/, '').split('/').filter(Boolean);
    return segs.length > 0 ? '../'.repeat(segs.length) : './';
  })();

  let searchIndex = [];
  let allArticles = [];
  let currentFilters = { category: '', tag: '', sort: 'newest' };
  let debounceTimer = null;

  async function loadIndex() {
    try {
      const res = await fetch(BASE + 'content/articles.json');
      allArticles = await res.json();
      searchIndex = allArticles.map(a => ({
        id: a.id,
        title: (a.title || '').toLowerCase(),
        description: (a.description || '').toLowerCase(),
        excerpt: (a.excerpt || '').toLowerCase(),
        category: a.category,
        categoryName: (a.categoryName || '').toLowerCase(),
        tags: (a.tags || []).map(t => t.toLowerCase()),
        date: a.date,
        views: a.views || 0,
        readingTime: a.readingTime || 0,
        slug: a.slug,
        cover: a.cover
      }));
      return true;
    } catch (e) {
      console.error('Search index load failed:', e);
      return false;
    }
  }

  function search(query, filters) {
    filters = filters || currentFilters;
    const q = (query || '').toLowerCase().trim();
    let results = allArticles.slice();

    /* Category filter */
    if (filters.category) {
      results = results.filter(a => a.category === filters.category);
    }
    /* Tag filter */
    if (filters.tag) {
      results = results.filter(a => a.tags && a.tags.some(t => t.toLowerCase() === filters.tag.toLowerCase()));
    }
    /* Text search */
    if (q) {
      results = results.filter(a => {
        const idx = searchIndex.find(s => s.id === a.id);
        if (!idx) return false;
        return idx.title.includes(q) || idx.description.includes(q) || idx.excerpt.includes(q) || idx.categoryName.includes(q) || idx.tags.some(t => t.includes(q));
      }).sort((a, b) => {
        const ia = searchIndex.find(s => s.id === a.id);
        const ib = searchIndex.find(s => s.id === b.id);
        const scoreA = scoreResult(ia, q);
        const scoreB = scoreResult(ib, q);
        return scoreB - scoreA;
      });
    } else {
      /* Default sort */
      applySortInPlace(results, filters.sort);
    }

    if (q && filters.sort !== 'relevance') applySortInPlace(results, filters.sort);

    return results;
  }

  function scoreResult(idx, q) {
    if (!idx) return 0;
    let score = 0;
    if (idx.title.startsWith(q)) score += 10;
    else if (idx.title.includes(q)) score += 5;
    if (idx.description.includes(q)) score += 3;
    if (idx.tags.some(t => t.includes(q))) score += 4;
    if (idx.categoryName.includes(q)) score += 2;
    return score;
  }

  function applySortInPlace(arr, sort) {
    switch (sort) {
      case 'oldest': arr.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'popular': arr.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
      case 'newest': default: arr.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
    }
  }

  function renderResults(results, container) {
    if (!container) return;
    if (!results.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🔍</div><h3 class="empty-state__title">No articles found</h3><p class="empty-state__text">Try different keywords or browse our categories below.</p></div>';
      return;
    }
    container.innerHTML = results.map(a => renderCard(a)).join('');
  }

  function renderCard(a) {
    const date = a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const cover = a.cover || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=70';
    return `
      <article class="card reveal">
        <a href="${BASE}articles/${a.slug}.html" class="card__image">
          <img src="${cover}" alt="${escHtml(a.title)}" loading="lazy">
          <span class="card__category-badge">${escHtml(a.categoryName || a.category)}</span>
        </a>
        <div class="card__body">
          <div class="card__meta">
            <span class="card__meta-item">📅 ${date}</span>
            <span class="card__meta-item">⏱️ ${a.readingTime || 5} min</span>
          </div>
          <h3 class="card__title"><a href="${BASE}articles/${a.slug}.html">${escHtml(a.title)}</a></h3>
          <p class="card__excerpt">${escHtml(a.excerpt || a.description || '')}</p>
          <div class="card__footer">
            <span class="card__reading">${formatViews(a.views)} views</span>
            <span class="card__arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </article>`;
  }

  function escHtml(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function formatViews(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : (n || 0); }

  function initSearchPage() {
    const input = document.getElementById('search-input');
    const resultsEl = document.getElementById('search-results');
    const countEl = document.getElementById('search-count');
    if (!input || !resultsEl) return;

    loadIndex().then(() => {
      /* Get query from URL */
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      if (q) input.value = q;

      /* Initial render */
      doSearch(q);

      /* Category filter buttons */
      document.querySelectorAll('[data-cat-filter]').forEach(btn => {
        btn.addEventListener('click', function () {
          document.querySelectorAll('[data-cat-filter]').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          currentFilters.category = this.dataset.catFilter;
          doSearch(input.value);
        });
      });

      /* Sort buttons */
      document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', function () {
          document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          currentFilters.sort = this.dataset.sort;
          doSearch(input.value);
        });
      });
    });

    /* Input event */
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => doSearch(this.value), 250);
    });

    /* Form submit */
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        doSearch(input.value);
      });
    }

    function doSearch(q) {
      const results = search(q, currentFilters);
      renderResults(results, resultsEl);
      if (countEl) countEl.textContent = results.length + ' article' + (results.length !== 1 ? 's' : '');
      if (window.KVLazy) window.KVLazy.init();
    }
  }

  /* Navbar quick search */
  function initNavSearch() {
    const btn = document.querySelector('.nav__search-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.location.href = './search.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavSearch();
    if (document.getElementById('search-input')) {
      initSearchPage();
    }
  });

  global.KVSearch = { search, loadIndex, renderCard };
})(window);
