/* =========================================================
   GrowWithViren — Scripts
   Navigation, scroll effects, reveal animations,
   count-up stats, and contact form handling.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header elevation on scroll ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile menu after selecting a link
  navMenu.querySelectorAll('.navbar__link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Apply per-element animation delays ---------- */
  document.querySelectorAll('[data-animate-delay]').forEach((el) => {
    const delay = el.getAttribute('data-animate-delay');
    el.style.setProperty('--animate-delay', `${delay}ms`);
  });

  /* ---------- Fade-up reveal on scroll ---------- */
  const animatedEls = document.querySelectorAll('[data-animate="fade-up"]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately
    animatedEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Count-up animation for stats ---------- */
  const statValues = document.querySelectorAll('.stat__value');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statValues.length) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statValues.forEach((el) => statObserver.observe(el));
  } else {
    statValues.forEach((el) => animateCount(el));
  }

 /* ---------- Contact form submission ---------- */

const contactForm = document.getElementById('contactForm');

if (contactForm) {

  contactForm.addEventListener('submit', function () {

    const submitBtn =
      contactForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

  });

}

  /* ---------- Footer current year ---------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
