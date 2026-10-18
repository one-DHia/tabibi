export type SupportedLanguage = 'fr' | 'ar' | 'en';

export interface TranslationSchema {
  common: {
    brand: string;
    loading: string;
    error_generic: string;
    cancel: string;
    confirm: string;
    back: string;
    phone: string;
    address: string;
    today: string;
  };
  home: {
    hero_title: string;
    hero_subtitle: string;
    benefit_link_title: string;
    benefit_link_desc: string;
    benefit_reminder_title: string;
    benefit_reminder_desc: string;
    cta_signup: string;
    cta_login: string;
  };
  auth: {
    login_title: string;
    signup_title: string;
    email_label: string;
    password_label: string;
    doctor_name_label: string;
    specialty_label: string;
    cabinet_phone_label: string;
    cabinet_address_label: string;
    cabinet_slug_label: string;
    login_btn: string;
    signup_btn: string;
    forgot_password_link: string;
    reset_password_title: string;
    reset_password_btn: string;
    verify_email_title: string;
    verify_email_desc: string;
    back_to_login: string;
  };
  dashboard: {
    title: string;
    tab_agenda: string;
    tab_schedules: string;
    tab_settings: string;
    cancel_btn: string;
    cancel_confirm: string;
    copy_link_btn: string;
    link_copied: string;
    print_qr_btn: string;
    save_schedules_btn: string;
    status_confirmed: string;
    status_cancelled: string;
    no_appointments: string;
  };
  booking: {
    page_title: string;
    select_date: string;
    select_time: string;
    no_slots_available: string;
    slot_locked_by_you: string;
    form_title: string;
    name_label: string;
    name_placeholder: string;
    whatsapp_label: string;
    whatsapp_notice: string;
    whatsapp_placeholder: string;
    submit_button: string;
    locking_slot: string;
    success_title: string;
    success_message: string;
    link_expired_title: string;
    link_expired_message: string;
    appointment_details: string;
    date_label: string;
    time_label: string;
    cabinet_label: string;
  };
  legal: {
    about_title: string;
    about_desc: string;
    support_title: string;
    support_desc: string;
    privacy_title: string;
    privacy_no_commercial: string;
    privacy_law: string;
    terms_title: string;
    terms_medical_law: string;
    terms_responsibilities: string;
    cookies_title: string;
    cookies_technical_only: string;
  };
  errors: {
    slot_already_taken: string;
    slot_lock_expired: string;
    invalid_phone: string;
    rate_limit_device: string;
    rate_limit_ip: string;
    cabinet_not_found: string;
    name_required: string;
  };
  whatsapp: {
    confirmation_header: string;
    date_prefix: string;
    time_prefix: string;
    address_prefix: string;
    cancellation_notice: string;
    automated_warning: string;
    reminder_24h_header: string;
    reminder_2h_header: string;
  };
}
