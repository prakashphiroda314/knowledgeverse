/* =============================================
   KnowledgeVerse — Main App
   Loads articles & categories, renders homepage
   ============================================= */
(function (global) {
  'use strict';

  const BASE = (function () {
    const scripts = document.querySelectorAll('script[src]');
    /* Try to detect base path from script location */
    return './';
  })();

  /* ── Utilities ─────────────────────────────── */
  function escHtml(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function formatViews(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : (n || 0); }
  function getArticleUrl(slug) { return './articles/' + slug + '.html'; }
  function getCategoryUrl(slug) { return './categories/' + slug + '.html'; }

  /* ── Fetch helpers ─────────────────────────── */
  async function fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      console.error('fetchJSON failed:', path, e);
      return null;
    }
  }

  /* ── Card Templates ────────────────────────── */
  function articleCard(a, opts) {
    opts = opts || {};
    const cover = a.cover || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=70';
    const url = getArticleUrl(a.slug);
    const featured = a.featured && opts.showFeatured ? '<span class="card__badge-featured">★ Featured</span>' : '';
    return `
    <article class="card reveal ${opts.className || ''}">
      <a href="${url}" class="card__image">
        <img src="${cover}" alt="${escHtml(a.title)}" loading="lazy">
        <span class="card__category-badge">${escHtml(a.categoryName || a.category)}</span>
        ${featured}
      </a>
      <div class="card__body">
        <div class="card__meta">
          <span class="card__meta-item">📅 ${formatDate(a.date)}</span>
          <span class="card__meta-item">⏱️ ${a.readingTime || 5} min</span>
          <span class="card__meta-item">👁️ ${formatViews(a.views)}</span>
        </div>
        <h3 class="card__title"><a href="${url}">${escHtml(a.title)}</a></h3>
        <p class="card__excerpt">${escHtml(a.excerpt || a.description || '')}</p>
        <div class="card__footer">
          <span class="card__reading">${a.readingLevel || 'Beginner'}</span>
          <a href="${url}" class="card__arrow" aria-label="Read article">→</a>
        </div>
      </div>
    </article>`;
  }

  function featuredCard(a) {
    const cover = a.cover || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=75';
    const url = getArticleUrl(a.slug);
    return `
    <article class="card card--featured reveal">
      <a href="${url}" class="card__image">
        <img src="${cover}" alt="${escHtml(a.title)}" loading="lazy">
        <span class="card__category-badge">${escHtml(a.categoryName || a.category)}</span>
        <span class="card__badge-featured">★ Featured</span>
      </a>
      <div class="card__body">
        <div class="card__meta">
          <span class="card__meta-item">📅 ${formatDate(a.date)}</span>
          <span class="card__meta-item">⏱️ ${a.readingTime || 5} min read</span>
          <span class="card__meta-item">👁️ ${formatViews(a.views)} views</span>
        </div>
        <h3 class="card__title"><a href="${url}">${escHtml(a.title)}</a></h3>
        <p class="card__excerpt">${escHtml(a.excerpt || a.description || '')}</p>
        <div class="card__footer">
          <span class="card__reading">${a.readingLevel || 'Beginner'} · ${a.readingTime || 5} min</span>
          <a href="${url}" class="btn btn-primary btn-sm">Read Article →</a>
        </div>
      </div>
    </article>`;
  }

  function trendingItem(a, num) {
    const url = getArticleUrl(a.slug);
    return `
    <div class="trending-item reveal">
      <span class="trending-num">${String(num).padStart(2, '0')}</span>
      <div class="trending-item__content">
        <div class="trending-item__category">${escHtml(a.categoryName || a.category)}</div>
        <a href="${url}" class="trending-item__title">${escHtml(a.title)}</a>
        <div class="trending-item__meta">
          <span>⏱️ ${a.readingTime || 5} min</span> · <span>👁️ ${formatViews(a.views)} views</span>
        </div>
      </div>
    </div>`;
  }

  function categoryCard(c) {
    const url = getCategoryUrl(c.slug);
    return `
    <a href="${url}" class="category-card reveal">
      <span class="category-card__icon">${escHtml(c.icon || '📂')}</span>
      <div class="category-card__name">${escHtml(c.name)}</div>
      <div class="category-card__count">${c.articleCount} articles</div>
      <p class="category-card__desc">${escHtml(c.description || '')}</p>
    </a>`;
  }

  /* ── Homepage Render ──────────────────────── */
  async function initHomepage() {
    const [articles, categories] = await Promise.all([
      fetchJSON('./content/articles.json'),
      fetchJSON('./content/categories.json')
    ]);
    if (!articles || !categories) return;

    /* Featured Articles */
    const featuredEl = document.getElementById('featured-articles');
    if (featuredEl) {
      const featured = articles.filter(a => a.featured).slice(0, 3);
      if (featured.length) {
        featuredEl.innerHTML = featuredCard(featured[0]) + featured.slice(1).map(a => articleCard(a, { showFeatured: true })).join('');
      }
    }

    /* Latest Articles */
    const latestEl = document.getElementById('latest-articles');
    if (latestEl) {
      const latest = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
      latestEl.innerHTML = latest.map(a => articleCard(a)).join('');
    }

    /* Editor's Picks */
    const editorsEl = document.getElementById('editors-picks');
    if (editorsEl) {
      const picks = articles.filter(a => a.editorsPick).slice(0, 3);
      editorsEl.innerHTML = picks.map(a => articleCard(a, { showFeatured: true })).join('');
    }

    /* Trending */
    const trendingEl = document.getElementById('trending-articles');
    if (trendingEl) {
      const trending = articles.filter(a => a.trending).slice(0, 5);
      trendingEl.innerHTML = trending.map((a, i) => trendingItem(a, i + 1)).join('');
    }

    /* Popular Reads */
    const popularEl = document.getElementById('popular-reads');
    if (popularEl) {
      const popular = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
      popularEl.innerHTML = popular.map(a => articleCard(a)).join('');
    }

    /* Recently Updated */
    const updatedEl = document.getElementById('recently-updated');
    if (updatedEl) {
      const updated = [...articles].sort((a, b) => new Date(b.lastUpdated || b.date) - new Date(a.lastUpdated || a.date)).slice(0, 4);
      updatedEl.innerHTML = updated.map(a => articleCard(a)).join('');
    }

    /* Popular Categories */
    const catsEl = document.getElementById('popular-categories');
    if (catsEl) {
      const featured = categories.filter(c => c.featured).slice(0, 10);
      catsEl.innerHTML = featured.map(c => categoryCard(c)).join('');
    }

    /* All categories in nav dropdown */
    const navCatsEl = document.getElementById('nav-categories');
    if (navCatsEl) {
      navCatsEl.innerHTML = categories.slice(0, 12).map(c =>
        `<a href="${getCategoryUrl(c.slug)}" class="nav__link">${c.icon} ${escHtml(c.name)}</a>`
      ).join('');
    }

    /* Animate lazy + reveal */
    if (window.KVLazy) window.KVLazy.init();
  }

  /* ── Category Page Render ──────────────────── */
  async function initCategoryPage() {
    const slug = document.body.dataset.category;
    if (!slug) return;
    const [articles, categories] = await Promise.all([
      fetchJSON('../content/articles.json'),
      fetchJSON('../content/categories.json')
    ]);
    if (!articles || !categories) return;
    const cat = categories.find(c => c.slug === slug);
    const catArticles = articles.filter(a => a.category === slug);

    const titleEl = document.getElementById('cat-title');
    const descEl = document.getElementById('cat-desc');
    const gridEl = document.getElementById('cat-articles');
    const countEl = document.getElementById('cat-count');
    const iconEl = document.getElementById('cat-icon');

    if (cat) {
      if (titleEl) titleEl.textContent = cat.name;
      if (descEl) descEl.textContent = cat.description;
      if (iconEl) iconEl.textContent = cat.icon;
      document.title = cat.name + ' — KnowledgeVerse';
    }
    if (countEl) countEl.textContent = catArticles.length + ' articles';
    if (gridEl) {
      if (!catArticles.length) {
        gridEl.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📭</div><h3 class="empty-state__title">No articles yet</h3><p class="empty-state__text">Check back soon — great content is on the way!</p></div>';
      } else {
        const mapped = catArticles.map(a => ({
          ...a,
          cover: a.cover ? a.cover.replace(/\?.*/, '?w=600&q=70') : a.cover
        }));
        gridEl.innerHTML = mapped.map(a => articleCard(a, { showFeatured: true })).join('');
      }
    }
    if (window.KVLazy) window.KVLazy.init();
  }

  /* ── Animate counters in hero stats ─────────── */
  function animateCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter);
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = (el.dataset.suffix ? current.toFixed(0) + el.dataset.suffix : Math.floor(current).toLocaleString());
      }, 16);
    });
  }

  /* ── Init ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.classList.contains('page-home')) initHomepage();
    if (document.body.classList.contains('page-category')) initCategoryPage();

    /* Counter animation on scroll */
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(statsSection);
    }

    /* Newsletter form - UI only */
    const nlForm = document.querySelector('.newsletter__form');
    if (nlForm) {
      nlForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = this.querySelector('.newsletter__input');
        const btn = this.querySelector('.newsletter__btn');
        if (input && input.value.trim()) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = '#10B981';
          input.value = '';
          setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.style.background = '';
          }, 3000);
        }
      });
    }
  });

  global.KVApp = { articleCard, categoryCard, trendingItem, featuredCard, getArticleUrl, getCategoryUrl };
})(window);
