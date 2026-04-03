const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const form = document.getElementById('requestForm');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const updateActiveLink = () => {
  const scrollY = window.scrollY + 120;
  let activeId = '';

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      activeId = `#${section.id}`;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === activeId);
  });
};

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Заявка отправлена';
      submitButton.disabled = true;
    }

    setTimeout(() => {
      alert('Демо-форма: здесь можно подключить Telegram, WhatsApp, email или CRM.');
      form.reset();
      if (submitButton) {
        submitButton.textContent = 'Отправить заявку';
        submitButton.disabled = false;
      }
    }, 200);
  });
}
