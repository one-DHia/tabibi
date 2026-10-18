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

async function loadAppointmentDetails(): Promise<void> {
  const token = window.location.pathname.replace(/^\/r\//, '');
  if (!token) return;

  try {
    const res = await fetch(`/api/appointment/${token}?lang=${currentLang}`);
    const data = await res.json();

    if (!data.success || data.expired) {
      document.getElementById('activeView')!.style.display = 'none';
      document.getElementById('expiredView')!.style.display = 'block';
      return;
    }

    const appt = data.appointment;
    document.getElementById('valDate')!.innerText = appt.appointmentDate;
    document.getElementById('valTime')!.innerText = appt.appointmentTime;
    document.getElementById('valCabinet')!.innerText = 'Cabinet Médical El Chifa';
    document.getElementById('valAddress')!.innerText = '12 Rue Didouche Mourad, Alger';
    document.getElementById('valPhone')!.innerText = '0550 12 34 56';
  } catch (err) {
    console.error('Failed to load appointment', err);
    document.getElementById('activeView')!.style.display = 'none';
    document.getElementById('expiredView')!.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
      loadAppointmentDetails();
    });
  });

  applyTranslations('fr');
  loadAppointmentDetails();
});
