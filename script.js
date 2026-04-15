const header = document.querySelector('.header');
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');
const mobileBackdrop = document.querySelector('.mobile-backdrop');
const serviceField = document.getElementById('serviceField');
const currentYear = document.getElementById('year');
const backToTop = document.querySelector('.back-to-top');
const progressBar = document.querySelector('.scroll-progress span');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopMedia = window.matchMedia('(min-width: 1121px)');
const premiumCards = Array.from(document.querySelectorAll('.premium-hover'));
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const navLinks = Array.from(document.querySelectorAll('.nav > a[href^="#"]'));

let lastScrollY = window.scrollY;

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

function updateBurgerState(isOpen) {
  if (!burgerBtn) return;
  burgerBtn.setAttribute('aria-expanded', String(isOpen));
  burgerBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
}

function updateMenuA11y(isOpen) {
  if (!navMenu) return;
  navMenu.setAttribute('aria-hidden', String(!isOpen && window.innerWidth <= 1120));
}

function openMenu() {
  if (!burgerBtn || !navMenu || window.innerWidth > 1120) return;
  navMenu.classList.add('is-open');
  document.body.classList.add('menu-open');
  updateBurgerState(true);
  updateMenuA11y(true);

  if (mobileBackdrop) {
    mobileBackdrop.hidden = false;
    requestAnimationFrame(() => mobileBackdrop.classList.add('show'));
  }
}

function closeMenu() {
  if (!navMenu) return;
  navMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  updateBurgerState(false);
  updateMenuA11y(false);

  if (mobileBackdrop) {
    mobileBackdrop.classList.remove('show');
    mobileBackdrop.hidden = true;
  }
}

function toggleMenu() {
  if (!navMenu) return;
  const isOpen = navMenu.classList.contains('is-open');
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function getHeaderOffset() {
  return header ? header.offsetHeight + 10 : 0;
}

function scrollToTarget(selector) {
  if (!selector || !selector.startsWith('#')) return;
  const target = document.querySelector(selector);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });

  history.replaceState(null, '', selector);
}

function setHeaderState() {
  if (!header) return;

  const currentScrollY = window.scrollY;
  header.classList.toggle('scrolled', currentScrollY > 16);

  if (!desktopMedia.matches || navMenu?.classList.contains('is-open')) {
    header.classList.remove('header--hidden');
    lastScrollY = currentScrollY;
    return;
  }

  const delta = currentScrollY - lastScrollY;

  if (currentScrollY <= 24) {
    header.classList.remove('header--hidden');
  } else if (delta > 10) {
    header.classList.add('header--hidden');
  } else if (delta < -10) {
    header.classList.remove('header--hidden');
  }

  lastScrollY = currentScrollY;
}

function updateScrollIndicators() {
  const currentScrollY = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? Math.min((currentScrollY / scrollHeight) * 100, 100) : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (backToTop) {
    backToTop.classList.toggle('show', currentScrollY > 460);
  }
}

if (burgerBtn) {
  burgerBtn.addEventListener('click', toggleMenu);
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener('click', closeMenu);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

Array.from(document.querySelectorAll('a[href^="#"], [data-scroll]')).forEach((element) => {
  element.addEventListener('click', (event) => {
    const selector = element.hasAttribute('data-scroll')
      ? element.getAttribute('data-scroll') || ''
      : element.getAttribute('href') || '';

    if (!selector || !selector.startsWith('#')) return;

    const target = document.querySelector(selector);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(selector);

    if (window.innerWidth <= 1120) {
      closeMenu();
    }
  });
});

Array.from(document.querySelectorAll('[data-service]')).forEach((button) => {
  button.addEventListener('click', () => {
    const selectedService = button.getAttribute('data-service');

    if (serviceField && selectedService) {
      serviceField.value = selectedService;
    }

    scrollToTarget('#contacts');
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const activeSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!activeSection?.target?.id) return;

    const currentId = `#${activeSection.target.id}`;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === currentId);
    });
  }, {
    threshold: 0.34,
    rootMargin: '-18% 0px -52% 0px'
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -6% 0px'
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

function attachDemoFormHandler(formId, messageId) {
  const form = document.getElementById(formId);
  const message = document.getElementById(messageId);

  if (!form || !message) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = 'Заявка принята. Здесь можно подключить отправку в Telegram, WhatsApp, email или CRM.';
    form.reset();
  });
}

attachDemoFormHandler('heroForm', 'heroFormMessage');
attachDemoFormHandler('contactForm', 'contactFormMessage');

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

const canUsePointerHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canUsePointerHover) {
  premiumCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

window.addEventListener('pageshow', closeMenu);
window.addEventListener('scroll', () => {
  setHeaderState();
  updateScrollIndicators();
}, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) {
    document.body.classList.remove('menu-open');
    navMenu?.classList.remove('is-open');
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('show');
      mobileBackdrop.hidden = true;
    }
    updateBurgerState(false);
    navMenu?.setAttribute('aria-hidden', 'false');
  } else {
    updateMenuA11y(navMenu?.classList.contains('is-open'));
  }

  setHeaderState();
  updateScrollIndicators();
}, { passive: true });

setHeaderState();
updateScrollIndicators();
closeMenu();
if (window.innerWidth > 1120) {
  navMenu?.setAttribute('aria-hidden', 'false');
}
