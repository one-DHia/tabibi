import { SupportedLanguage } from '../../types/i18n.types.js';
import { dictionaries } from '../../i18n/index.js';

let currentLang: SupportedLanguage = 'fr';

function applyTranslations(lang: SupportedLanguage): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const dict = dictionaries[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const parts = key.split('.');
    let val: any = dict;
    for (const part of parts) {
      val = val?.[part];
    }
    if (val) (el as HTMLElement).innerText = val;
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function showTab(tab: 'login' | 'signup' | 'reset'): void {
  const loginForm = document.getElementById('loginForm') as HTMLElement;
  const signupForm = document.getElementById('signupForm') as HTMLElement;
  const resetForm = document.getElementById('resetPasswordForm') as HTMLElement;
  const verifyBox = document.getElementById('verifyEmailBox') as HTMLElement;
  const authTabs = document.getElementById('authTabs') as HTMLElement;
  const authTitle = document.getElementById('authTitle') as HTMLElement;

  loginForm.style.display = tab === 'login' ? 'block' : 'none';
  signupForm.style.display = tab === 'signup' ? 'block' : 'none';
  resetForm.style.display = tab === 'reset' ? 'block' : 'none';
  verifyBox.style.display = 'none';

  authTabs.style.display = tab === 'reset' ? 'none' : 'flex';

  document.getElementById('tabLogin')?.classList.toggle('active', tab === 'login');
  document.getElementById('tabSignup')?.classList.toggle('active', tab === 'signup');

  if (tab === 'login') authTitle.innerText = dictionaries[currentLang].auth.login_title;
  if (tab === 'signup') authTitle.innerText = dictionaries[currentLang].auth.signup_title;
  if (tab === 'reset') authTitle.innerText = dictionaries[currentLang].auth.reset_password_title;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tabLogin')?.addEventListener('click', () => showTab('login'));
  document.getElementById('tabSignup')?.addEventListener('click', () => showTab('signup'));
  document.getElementById('linkForgotPassword')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTab('reset');
  });
  document.getElementById('linkBackToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTab('login');
  });

  // Handle Signup
  document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerText = dictionaries[currentLang].common.loading;

    const email = (document.getElementById('signupEmail') as HTMLInputElement).value;
    const password = (document.getElementById('signupPassword') as HTMLInputElement).value;
    const doctorName = (document.getElementById('signupDoctorName') as HTMLInputElement).value;
    const specialty = (document.getElementById('signupSpecialty') as HTMLInputElement).value;
    const phone = (document.getElementById('signupPhone') as HTMLInputElement).value;
    const address = (document.getElementById('signupAddress') as HTMLInputElement).value;
    const slug = (document.getElementById('signupSlug') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, doctorName, specialty, phone, address, slug }),
      });
      const data = await res.json();
      if (data.success) {
        const signupForm = document.getElementById('signupForm') as HTMLElement;
        const verifyBox = document.getElementById('verifyEmailBox') as HTMLElement;
        signupForm.style.display = 'none';
        verifyBox.style.display = 'block';
      } else {
        alert(data.error || 'Erreur lors de l’inscription');
        btn.disabled = false;
        btn.innerText = dictionaries[currentLang].auth.signup_btn;
      }
    } catch {
      alert(dictionaries[currentLang].common.error_generic);
      btn.disabled = false;
      btn.innerText = dictionaries[currentLang].auth.signup_btn;
    }
  });

  // Handle Login
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerText = dictionaries[currentLang].common.loading;

    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Identifiants invalides');
        btn.disabled = false;
        btn.innerText = dictionaries[currentLang].auth.login_btn;
      }
    } catch {
      alert(dictionaries[currentLang].common.error_generic);
      btn.disabled = false;
      btn.innerText = dictionaries[currentLang].auth.login_btn;
    }
  });

  // Handle Reset Password
  document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerText = dictionaries[currentLang].common.loading;
    const email = (document.getElementById('resetEmail') as HTMLInputElement).value;
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Lien de réinitialisation envoyé à votre e-mail !');
        showTab('login');
      } else {
        alert(data.error || 'Erreur');
      }
    } catch {
      alert(dictionaries[currentLang].common.error_generic);
    } finally {
      btn.disabled = false;
      btn.innerText = dictionaries[currentLang].auth.reset_password_btn;
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
    });
  });

  applyTranslations('fr');

  if (window.location.pathname.includes('signup')) {
    showTab('signup');
  } else if (window.location.pathname.includes('reset') || window.location.pathname.includes('forgot')) {
    showTab('reset');
  } else {
    showTab('login');
  }
});
