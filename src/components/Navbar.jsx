import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Stethoscope, Globe, Check, User, LogOut } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, changeLanguage, t } = useLanguage();
    const { isAuthenticated, user, logout } = useAuth();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const { t: tLang } = useLanguage(); // Renamed to avoid collision or clarity issues if needed, but standard t is fine. Using standard t.

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    const languages = [
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ar', label: 'العربية', flag: '🇩🇿' }
    ];

    return (
        <motion.nav
            initial={{ y: 0 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}
        >
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className={`
                    flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500
                    ${isScrolled ? 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5' : 'bg-transparent'}
                `}>

                    {/* Logo - Magnetic */}
                    <MagneticButton>
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold tracking-tight font-display">{t('nav.brand')}</span>
                        </Link>
                    </MagneticButton>

                    {/* Desktop Navigation - Clean & Swiss */}
                    <div className="hidden md:flex items-center gap-1">
                        <MagneticButton>
                            <Link to="/" className="px-5 py-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-black/5 block">
                                {t('nav.home') || "Accueil"}
                            </Link>
                        </MagneticButton>
                        <MagneticButton>
                            <Link to="/search" className="px-5 py-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-black/5 block">
                                {t('nav.search')}
                            </Link>
                        </MagneticButton>
                        <MagneticButton>
                            <Link to="/concept" className="px-5 py-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-black/5 block">
                                {t('nav.how_it_works')}
                            </Link>
                        </MagneticButton>
                        <MagneticButton>
                            <Link to="/sos" className="px-5 py-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors rounded-full bg-red-50 hover:bg-red-100 block border border-red-200 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                SOS
                            </Link>
                        </MagneticButton>
                        {isAuthenticated && (user?.role === 'doctor' || user?.role === 'admin') && (
                            <MagneticButton>
                                <Link to="/admin" className="px-5 py-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-black/5 block">
                                    {t('nav.pro_space')}
                                </Link>
                            </MagneticButton>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                            >
                                <Globe className="w-5 h-5 text-zinc-600" />
                            </button>

                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 min-w-[160px] overflow-hidden"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${language === lang.code
                                                    ? 'bg-zinc-100 text-zinc-900'
                                                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>{lang.flag}</span>
                                                    {lang.label}
                                                </span>
                                                {language === lang.code && <Check className="w-4 h-4 text-emerald-500" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="hidden lg:block text-sm font-medium text-zinc-600 mr-2">
                                    {user?.name || 'Dr. User'}
                                </span>
                                <MagneticButton>
                                    <Link
                                        to={user?.role === 'admin' ? '/admin' : '/doctor/profile'}
                                        className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                    </Link>
                                </MagneticButton>
                                <MagneticButton>
                                    <button
                                        onClick={logout}
                                        className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                                        title={t('nav.logout')}
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </MagneticButton>
                            </div>
                        ) : (
                            <>
                                <MagneticButton>
                                    <Link to="/login" className="px-5 py-2 text-sm font-bold text-zinc-900">
                                        {t('nav.login') || "Connexion"}
                                    </Link>
                                </MagneticButton>
                                <MagneticButton>
                                    <Link to="/signup" className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-emerald-600 transition-colors">
                                        {t('nav.signup') || "Inscription"}
                                    </Link>
                                </MagneticButton>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
