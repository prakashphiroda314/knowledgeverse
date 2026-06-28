/* =============================================
   KnowledgeVerse — Lazy Load & Scroll Reveal
   ============================================= */
(function () {
  'use strict';

  /* Lazy images */
  function initLazyImages() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    } else {
      /* Fallback for old browsers */
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      });
    }
  }

  /* Scroll reveal animations */
  function initReveal() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLazyImages();
    initReveal();
  });

  /* Re-init when new content added */
  window.KVLazy = { init: function () { initLazyImages(); initReveal(); } };
})();
