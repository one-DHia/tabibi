import { SupportedLanguage } from '../../types/i18n.types.js';
import { dictionaries } from '../../i18n/index.js';

function applyTranslations(lang: SupportedLanguage): void {
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

function showSection(section: 'about' | 'privacy' | 'terms' | 'cookies'): void {
  document.getElementById('secAbout')!.style.display = section === 'about' ? 'block' : 'none';
  document.getElementById('secPrivacy')!.style.display = section === 'privacy' ? 'block' : 'none';
  document.getElementById('secTerms')!.style.display = section === 'terms' ? 'block' : 'none';
  document.getElementById('secCookies')!.style.display = section === 'cookies' ? 'block' : 'none';

  document.getElementById('tabAbout')?.classList.toggle('active', section === 'about');
  document.getElementById('tabPrivacy')?.classList.toggle('active', section === 'privacy');
  document.getElementById('tabTerms')?.classList.toggle('active', section === 'terms');
  document.getElementById('tabCookies')?.classList.toggle('active', section === 'cookies');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tabAbout')?.addEventListener('click', () => showSection('about'));
  document.getElementById('tabPrivacy')?.addEventListener('click', () => showSection('privacy'));
  document.getElementById('tabTerms')?.addEventListener('click', () => showSection('terms'));
  document.getElementById('tabCookies')?.addEventListener('click', () => showSection('cookies'));

  // Detect route based on path
  const path = window.location.pathname.replace(/^\//, '');
  if (['about', 'privacy', 'terms', 'cookies'].includes(path)) {
    showSection(path as any);
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
    });
  });

  applyTranslations('fr');
});
