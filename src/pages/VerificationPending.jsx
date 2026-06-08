import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const VerificationPending = () => {
    const { t } = useLanguage();
    const { verifyOtp } = useAuth();
    const location = useLocation();

    // Get email from navigation state or fallback
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (value.length === 6 && !isNaN(value)) {
            setOtp(value.split(""));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = otp.join("");
        if (token.length !== 6) {
            setError(t('verification.invalid_code') || "Le code doit contenir 6 chiffres");
            setIsLoading(false);
            return;
        }

        try {
            await verifyOtp(email, token);
            // Redirect handled in AuthContext
        } catch (err) {
            console.error(err);
            setError(t('verification.error') || "Code invalide ou expiré. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/10 text-center border border-slate-100"
            >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <ShieldCheck className="w-12 h-12 text-emerald-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
                    {t('verification.enter_code') || "Vérifiez votre email"}
                </h1>

                <p className="text-slate-500 mb-8 text-sm">
                    {t('verification.sent_to') || "Nous avons envoyé un code à 6 chiffres à :"}<br />
                    <span className="font-bold text-slate-800">{email || "votre adresse email"}</span>
                </p>

                {!email && (
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            className="w-full p-2 border rounded-lg mb-4 text-center"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-14 border border-slate-300 rounded-xl text-center text-2xl font-bold text-emerald-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || otp.join("").length !== 6}
                        className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {t('verification.submit') || "Valider le code"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-sm">
                    <Link to="/login" className="text-slate-400 hover:text-slate-600 transition-colors">
                        {t('verification.wrong_email') || "Ce n'est pas votre email ?"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default VerificationPending;
