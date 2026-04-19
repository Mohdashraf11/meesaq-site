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
    charCount.textContent = len + ' / 15 characters minimum';
    charCount.style.color = len >= 15 ? 'var(--success)' : 'var(--text-muted)';
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

/* ── FORM SUBMIT (AJAX — no redirect, no Formspree page) ── */
async function handleSubmit(e) {
  e.preventDefault(); // Always prevent default — we handle everything here
 
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
 
  if (reqText && (!reqText.value.trim() || reqText.value.trim().length < 15)) {
    showError('err-requirement', reqText); valid = false;
  } else if (reqText) { clearError('err-requirement', reqText); }
 
  if (!valid) return; // Stop here if any field is invalid
 
  // Lock button while submitting
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Submitting...';
 
  try {
    const response = await fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    });
 
    if (response.ok) {
      btn.textContent = '✓ Requirement Submitted Successfully';
      btn.style.background = '#059669';
      e.target.reset();
      if (charCount) {
        charCount.textContent = '0 / 15 characters minimum';
        charCount.style.color = '';
      }
      document.querySelectorAll('.valid, .invalid')
        .forEach(el => el.classList.remove('valid', 'invalid'));
 
      // Re-enable button after a few seconds so they can submit again if needed
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Submit Requirement →';
        btn.style.background = '';
      }, 5000);
 
    } else {
      // ❌ Formspree returned an error
      throw new Error('Formspree error: ' + response.status);
    }
 
  } catch (err) {
    // ❌ Network or server error
    btn.disabled = false;
    btn.textContent = 'Submit Requirement →';
    btn.style.background = '';
    alert('Something went wrong. Please try again or contact us on WhatsApp.');
    console.error(err);
  }
}