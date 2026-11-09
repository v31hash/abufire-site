// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form validation + submission
const form = document.getElementById('contactForm');
const status = form.querySelector('.form-status');
const submitBtn = form.querySelector('button[type="submit"]');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^[0-9+()\-.\s]{7,20}$/;

function setError(field, msg) {
  field.classList.toggle('invalid', !!msg);
  field.querySelector('.err').textContent = msg || '';
}

function validate() {
  let ok = true;
  const get = id => form.elements[id];
  const checks = [
    ['name',    v => v.trim().length >= 2, 'Please enter your name.'],
    ['email',   v => emailRe.test(v.trim()), 'Please enter a valid email address.'],
    ['phone',   v => phoneRe.test(v.trim()), 'Please enter a valid phone number.'],
    ['service', v => v !== '', 'Please choose a service.'],
    ['message', v => v.trim().length >= 10, 'Please provide a few more details (10+ characters).'],
  ];
  checks.forEach(([id, test, msg]) => {
    const el = get(id);
    const valid = test(el.value);
    setError(el.closest('[data-field]'), valid ? '' : msg);
    if (!valid && ok) el.focus();
    if (!valid) ok = false;
  });
  return ok;
}

form.addEventListener('input', e => {
  const field = e.target.closest('[data-field]');
  if (field && field.classList.contains('invalid')) validate();
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  // Honeypot: silently stop if a bot filled the hidden field
  if (form.website.value) return;

  if (!validate()) {
    status.textContent = 'Please correct the highlighted fields.';
    status.classList.add('fail');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    // TODO: Connect to your backend or form service (see notes).
    // Example: const res = await fetch('/contact.php', { method: 'POST', body: new FormData(form) });
    await new Promise(r => setTimeout(r, 800)); // placeholder for the real request
    form.reset();
    status.textContent = 'Thank you! Your message has been sent. We will be in touch shortly.';
    status.classList.add('ok');
  } catch (err) {
    status.textContent = 'Something went wrong. Please call 289-314-3990 or email us directly.';
    status.classList.add('fail');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});