import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CookieBanner = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('tabibi-cookie-consent');
        if (!consent) {
            // Show with a slight delay for smooth entrance
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('tabibi-cookie-consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-8 md:w-[400px] z-50"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                <Cookie className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-white font-bold text-lg mb-2">Cookies</h3>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    {t('cookie.text')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/25"
                                    >
                                        {t('cookie.accept')}
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                                    >
                                        {t('cookie.decline')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
