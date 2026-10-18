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
  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const signupForm = document.getElementById('signupForm') as HTMLElement;
    const verifyBox = document.getElementById('verifyEmailBox') as HTMLElement;

    signupForm.style.display = 'none';
    verifyBox.style.display = 'block';
  });

  // Handle Login
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Redirect to dashboard on successful login
    window.location.href = '/dashboard';
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
