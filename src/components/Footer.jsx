import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto pt-12 pb-8">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                            <span className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>{t('nav.brand')}</span>
                        </div>
                        <p className="text-sm text-gray-500" style={{ lineHeight: '1.6' }}>
                            {t('footer.desc')}
                        </p>
                    </div>

                    {/* About */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900">{t('footer.directory')}</h3>
                        <Link to="/search" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.search_doctor')}</Link>
                        <Link to="/search?q=Dentiste" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.dentists')}</Link>
                        <Link to="/search?q=Cardiologue" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.cardiologists')}</Link>
                    </div>

                    {/* Patients */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900">{t('footer.help')}</h3>
                        <Link to="/concept" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.how_it_works')}</Link>
                        <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.help_center')}</Link>
                    </div>

                    {/* Doctors */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900">{t('footer.professionals')}</h3>
                        {/* <Link to="/doctor/signup" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.register_practice')}</Link> */}
                        {/* <Link to="/doctor/login" className="text-sm text-gray-600 hover:text-primary-600">{t('footer.pro_login')}</Link> */}
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        {t('footer.copyright', { year: currentYear })}
                        <span className="mx-2">|</span>
                        <Link to="/privacy" className="hover:text-primary-600 transition-colors">{t('footer.privacy')}</Link>
                        <span className="mx-2">•</span>
                        <Link to="/terms" className="hover:text-primary-600 transition-colors">{t('footer.terms')}</Link>
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
