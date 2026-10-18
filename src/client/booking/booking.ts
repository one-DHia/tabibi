import { TimeSlot } from '../../types/booking.types.js';
import { SupportedLanguage } from '../../types/i18n.types.js';
import { dictionaries } from '../../i18n/index.js';

let currentLang: SupportedLanguage = 'fr';
let selectedTime: string | null = null;
let currentSlug = window.location.pathname.split('/').filter(Boolean)[0] || 'cabinet-el-chifa';

// Device ID persistence
function getDeviceId(): string {
  let id = localStorage.getItem('tabibi_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('tabibi_device_id', id);
  }
  return id;
}

const deviceId = getDeviceId();

// Translate UI elements
function applyTranslations(lang: SupportedLanguage): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const dict = dictionaries[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const [section, subkey] = key.split('.') as ['booking' | 'common', string];
    const val = (dict as any)?.[section]?.[subkey];
    if (val) (el as HTMLElement).innerText = val;
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// Load Cabinet Information
async function loadCabinet(): Promise<void> {
  try {
    const res = await fetch(`/api/cabinet/${currentSlug}`);
    const data = await res.json();
    if (data.success && data.cabinet) {
      (document.getElementById('cabinetName') as HTMLElement).innerText = data.cabinet.name;
      (document.getElementById('cabinetSpecialty') as HTMLElement).innerText = data.cabinet.specialty;
      (document.getElementById('cabinetAddress') as HTMLElement).innerText = `📍 ${data.cabinet.address}`;
      (document.getElementById('cabinetPhone') as HTMLElement).innerText = `📞 ${data.cabinet.phone}`;
    }
  } catch (err) {
    console.error('Failed to load cabinet', err);
  }
}

// Fetch Slots
async function loadSlots(dateStr: string): Promise<void> {
  const container = document.getElementById('slotsContainer') as HTMLElement;
  container.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted);">${dictionaries[currentLang].common.loading}</div>`;

  try {
    const res = await fetch(`/api/cabinet/${currentSlug}/slots?date=${dateStr}&deviceId=${deviceId}`);
    const data = await res.json();
    container.innerHTML = '';

    if (!data.slots || data.slots.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1;">${dictionaries[currentLang].booking.no_slots_available}</div>`;
      return;
    }

    data.slots.forEach((slot: TimeSlot) => {
      const btn = document.createElement('div');
      btn.className = `slot-item ${slot.status === 'available' ? '' : 'disabled'}`;
      btn.innerText = slot.time;

      if (slot.status === 'available') {
        btn.onclick = () => selectSlot(slot.time, btn);
      }
      container.appendChild(btn);
    });
  } catch (err) {
    console.error('Error loading slots', err);
  }
}

// Select & Lock Slot (15-min Lock)
async function selectSlot(time: string, element: HTMLElement): Promise<void> {
  const dateInput = document.getElementById('appointmentDate') as HTMLInputElement;
  const lockRes = await fetch(`/api/cabinet/${currentSlug}/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: dateInput.value, time, deviceId }),
  });

  const lockData = await lockRes.json();
  if (!lockData.success) {
    alert(dictionaries[currentLang].errors.slot_already_taken);
    return;
  }

  document.querySelectorAll('.slot-item').forEach((el) => el.classList.remove('selected'));
  element.classList.add('selected');
  selectedTime = time;

  (document.getElementById('lockBanner') as HTMLElement).style.display = 'block';
  (document.getElementById('submitBooking') as HTMLButtonElement).disabled = false;
}

// Submit Booking
async function submitBooking(): Promise<void> {
  const date = (document.getElementById('appointmentDate') as HTMLInputElement).value;
  const patientName = (document.getElementById('patientName') as HTMLInputElement).value.trim();
  const patientWhatsapp = (document.getElementById('patientWhatsapp') as HTMLInputElement).value.trim();

  if (!patientName || !patientWhatsapp || !selectedTime) return;

  const btn = document.getElementById('submitBooking') as HTMLButtonElement;
  btn.disabled = true;
  btn.innerText = dictionaries[currentLang].common.loading;

  const res = await fetch(`/api/cabinet/${currentSlug}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time: selectedTime, patientName, patientWhatsapp, deviceId }),
  });

  const result = await res.json();
  if (result.success && result.appointment) {
    (document.getElementById('bookingCard') as HTMLElement).style.display = 'none';
    const successCard = document.getElementById('successCard') as HTMLElement;
    successCard.style.display = 'block';

    const details = document.getElementById('confirmedDetails') as HTMLElement;
    details.innerHTML = `
      <strong>${patientName}</strong><br>
      📅 ${result.appointment.appointmentDate} à ${result.appointment.appointmentTime}<br>
      💬 WhatsApp: ${patientWhatsapp}
    `;
  } else {
    alert(dictionaries[currentLang].errors[result.error as keyof typeof dictionaries.fr.errors] || 'Erreur');
    btn.disabled = false;
    btn.innerText = dictionaries[currentLang].booking.submit_button;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('appointmentDate') as HTMLInputElement;
  dateInput.value = new Date().toISOString().split('T')[0];
  dateInput.min = dateInput.value;

  dateInput.onchange = () => loadSlots(dateInput.value);
  (document.getElementById('submitBooking') as HTMLButtonElement).onclick = submitBooking;

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as SupportedLanguage;
      applyTranslations(lang);
    });
  });

  applyTranslations('fr');
  loadCabinet();
  loadSlots(dateInput.value);
});
