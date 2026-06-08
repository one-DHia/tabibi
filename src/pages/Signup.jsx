import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Stethoscope, ArrowRight, ChevronLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { specialties, wilayas } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { t, language } = useLanguage();
    const { signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            alert(t('signup.fill_all_fields'));
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.email, formData.password, {
                name: formData.name,
                role: 'user', // Explicitly user/patient
                lang: language
            });
        } catch (error) {
            console.error("Signup error", error);
            setIsLoading(false);
            alert("Erreur lors de l'inscription. Vérifiez votre email ou réessayez.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative z-20">
            <div className="w-full max-w-xl">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors group text-sm font-medium">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:ml-1 rtl:mr-0 rtl:group-hover:translate-x-1" />
                    {t('nav.brand')}
                </Link>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">
                            {t('signup.title') || "Créer un compte"}
                        </h1>
                        <p className="text-slate-500">
                            {t('signup.subtitle') || "Rejoignez Tabibi pour gérer vos rendez-vous"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('signup.name_label')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('signup.email_label')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('signup.password_label')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 text-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {t('signup.submit')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {t('signup.has_account')} <Link to="/login" className="text-slate-900 font-bold hover:text-emerald-600 ml-1 transition-colors">{t('signup.login_link')}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
