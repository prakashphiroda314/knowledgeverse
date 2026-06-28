/* =============================================
   KnowledgeVerse — Navigation
   ============================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');
    const backToTop = document.querySelector('.back-to-top');
    const readingProgress = document.querySelector('.reading-progress');

    /* Sticky nav scroll effect */
    let lastScroll = 0;
    function onScroll() {
      const scrollY = window.scrollY;
      if (nav) {
        nav.classList.toggle('scrolled', scrollY > 20);
      }
      if (backToTop) {
        backToTop.classList.toggle('visible', scrollY > 400);
      }
      if (readingProgress) {
        const article = document.querySelector('.article__content');
        if (article) {
          const articleTop = article.offsetTop;
          const articleHeight = article.offsetHeight;
          const windowHeight = window.innerHeight;
          const scrolled = Math.max(0, scrollY - articleTop);
          const total = articleHeight - windowHeight;
          const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
          readingProgress.style.width = pct + '%';
        }
      }
      lastScroll = scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
      });
      mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
        link.addEventListener('click', function () {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* Back to top */
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* Active nav link */
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.endsWith(href) || (href !== '/' && href !== 'index.html' && currentPath.includes(href.replace('.html', ''))))) {
        link.classList.add('active');
      }
    });

    /* FAQ accordion */
    document.querySelectorAll('.faq__question').forEach(btn => {
      btn.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const isOpen = this.classList.contains('open');
        document.querySelectorAll('.faq__question.open').forEach(q => {
          q.classList.remove('open');
          if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
          this.classList.add('open');
          if (answer) answer.classList.add('open');
        }
      });
    });

    /* Cookie banner */
    const cookieBanner = document.querySelector('.cookie-banner');
    if (cookieBanner && !localStorage.getItem('kv-cookie-accepted')) {
      setTimeout(() => cookieBanner.classList.add('visible'), 1200);
      const acceptBtn = cookieBanner.querySelector('[data-cookie-accept]');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
          localStorage.setItem('kv-cookie-accepted', '1');
          cookieBanner.classList.remove('visible');
        });
      }
    }

    /* Smooth anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72) + 20;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  });
})();
