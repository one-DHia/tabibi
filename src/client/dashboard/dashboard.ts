import { SupportedLanguage } from '../../types/i18n.types.js';
import { dictionaries } from '../../i18n/index.js';

let currentLang: SupportedLanguage = 'fr';
const cabinetSlug = 'cabinet-el-chifa';

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

function switchTab(tab: 'agenda' | 'schedules' | 'settings'): void {
  document.getElementById('tabAgenda')!.style.display = tab === 'agenda' ? 'block' : 'none';
  document.getElementById('tabSchedules')!.style.display = tab === 'schedules' ? 'block' : 'none';
  document.getElementById('tabSettings')!.style.display = tab === 'settings' ? 'block' : 'none';

  document.getElementById('tabBtnAgenda')?.classList.toggle('active', tab === 'agenda');
  document.getElementById('tabBtnSchedules')?.classList.toggle('active', tab === 'schedules');
  document.getElementById('tabBtnSettings')?.classList.toggle('active', tab === 'settings');
}

// Mock appointments for demo
const mockAppointments = [
  { id: '1', time: '09:00', patient: 'Amina Mansouri', phone: '0551 22 33 44', status: 'confirmed' },
  { id: '2', time: '10:30', patient: 'Karim Boukhalfa', phone: '0770 99 88 77', status: 'confirmed' },
  { id: '3', time: '14:00', patient: 'Yassine Belkacem', phone: '0661 11 22 33', status: 'confirmed' },
];

function renderAppointments(): void {
  const tbody = document.getElementById('appointmentsList') as HTMLElement;
  tbody.innerHTML = '';

  mockAppointments.forEach((appt) => {
    const tr = document.createElement('tr');
    tr.id = `appt-row-${appt.id}`;
    tr.innerHTML = `
      <td><span class="time-badge">${appt.time}</span></td>
      <td><strong>${appt.patient}</strong></td>
      <td><a href="https://wa.me/${appt.phone.replace(/\s+/g, '')}" target="_blank" style="color: #059669; text-decoration: none;">💬 ${appt.phone}</a></td>
      <td><span class="status-badge ${appt.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled'}" id="status-${appt.id}">${appt.status === 'confirmed' ? dictionaries[currentLang].dashboard.status_confirmed : dictionaries[currentLang].dashboard.status_cancelled}</span></td>
      <td>
        ${appt.status === 'confirmed' ? `<button class="btn-cancel" onclick="window.cancelAppt('${appt.id}')">${dictionaries[currentLang].dashboard.cancel_btn}</button>` : '—'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

(window as any).cancelAppt = async (id: string) => {
  if (!confirm(dictionaries[currentLang].dashboard.cancel_confirm)) return;

  try {
    await fetch(`/api/cabinet/appointments/${id}/cancel`, { method: 'POST' });
    const target = mockAppointments.find((a) => a.id === id);
    if (target) target.status = 'cancelled';
    renderAppointments();
  } catch (err) {
    console.error('Cancellation failed', err);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tabBtnAgenda')?.addEventListener('click', () => switchTab('agenda'));
  document.getElementById('tabBtnSchedules')?.addEventListener('click', () => switchTab('schedules'));
  document.getElementById('tabBtnSettings')?.addEventListener('click', () => switchTab('settings'));

  const shareInput = document.getElementById('cabinetShareUrl') as HTMLInputElement;
  shareInput.value = `${window.location.origin}/${cabinetSlug}`;

  document.getElementById('btnCopyLink')?.addEventListener('click', () => {
    navigator.clipboard.writeText(shareInput.value);
    alert(dictionaries[currentLang].dashboard.link_copied);
  });

  const datePicker = document.getElementById('agendaDatePicker') as HTMLInputElement;
  datePicker.value = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
      renderAppointments();
    });
  });

  applyTranslations('fr');
  renderAppointments();
});
