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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
    });
  });

  applyTranslations('fr');
});
