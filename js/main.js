/* ============================================================
   MEESAQ AL AMANA — Main JavaScript
   ============================================================ */

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

/* ── VALIDATION HELPERS ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
function isValidPhone(phone) {
  return /^[0-9\s\-]{6,15}$/.test(phone.trim());
}
function showError(id, el) {
  const err = document.getElementById(id);
  if (err) err.classList.add('show');
  el.classList.add('invalid');
  el.classList.remove('valid');
}
function clearError(id, el) {
  const err = document.getElementById(id);
  if (err) err.classList.remove('show');
  el.classList.remove('invalid');
  el.classList.add('valid');
}

/* ── CHARACTER COUNT ── */
const reqText   = document.getElementById('requirementText');
const charCount = document.getElementById('char-count');
if (reqText && charCount) {
  reqText.addEventListener('input', () => {
    const len = reqText.value.length;
    charCount.textContent = len + ' / 20 characters minimum';
    charCount.style.color = len >= 20 ? 'var(--success)' : 'var(--text-muted)';
  });
}

/* ── LIVE EMAIL VALIDATION ── */
const emailInput = document.getElementById('emailInput');
if (emailInput) {
  emailInput.addEventListener('blur', () => {
    if (!emailInput.value) return;
    isValidEmail(emailInput.value)
      ? clearError('err-email', emailInput)
      : showError('err-email', emailInput);
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('invalid') && isValidEmail(emailInput.value))
      clearError('err-email', emailInput);
  });
}

/* ── PHONE — DIGITS ONLY ── */
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9\s\-]/g, '');
  });
  phoneInput.addEventListener('blur', () => {
    if (!phoneInput.value) return;
    isValidPhone(phoneInput.value)
      ? clearError('err-phone', phoneInput)
      : showError('err-phone', phoneInput);
  });
}

/* ── FORM SUBMIT ── */
function handleSubmit(e) {
  let valid = true;

  const name = e.target.querySelector('[name=name]');
  if (!name.value.trim() || name.value.trim().length < 2) {
    showError('err-name', name); valid = false;
  } else { clearError('err-name', name); }

  if (emailInput && !isValidEmail(emailInput.value)) {
    showError('err-email', emailInput); valid = false;
  } else if (emailInput) { clearError('err-email', emailInput); }

  if (phoneInput && !isValidPhone(phoneInput.value)) {
    showError('err-phone', phoneInput); valid = false;
  } else if (phoneInput) { clearError('err-phone', phoneInput); }

  const cat = document.getElementById('categorySelect');
  if (cat && !cat.value) { showError('err-category', cat); valid = false; }
  else if (cat) { clearError('err-category', cat); }

  const dest = document.getElementById('destinationSelect');
  if (dest && !dest.value) { showError('err-destination', dest); valid = false; }
  else if (dest) { clearError('err-destination', dest); }

  if (reqText && (!reqText.value.trim() || reqText.value.trim().length < 20)) {
    showError('err-requirement', reqText); valid = false;
  } else if (reqText) { clearError('err-requirement', reqText); }

  if (!valid) { e.preventDefault(); return; }

  /* If Formspree not configured yet — show mock success for local testing */
  const action = e.target.getAttribute('action') || '';
  if (action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = '✓ Requirement Submitted Successfully';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.textContent = 'Submit Requirement';
      btn.style.background = '';
      e.target.reset();
      if (charCount) { charCount.textContent = '0 / 20 characters minimum'; charCount.style.color = ''; }
      document.querySelectorAll('.valid,.invalid').forEach(el => el.classList.remove('valid','invalid'));
    }, 3500);
  }
  /* Real Formspree ID → form submits normally */
}

/* ── SUCCESS ON RETURN FROM FORMSPREE ── */
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('submitted') === 'true') {
  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.textContent = '✓ Requirement Submitted Successfully';
    btn.style.background = '#059669';
  }
}
