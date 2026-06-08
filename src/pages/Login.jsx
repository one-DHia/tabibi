import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
            alert(t('login.error') || "Échec de la connexion. Vérifiez vos identifiants.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative z-20">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors group text-sm font-medium">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:ml-1 rtl:mr-0 rtl:group-hover:translate-x-1" />
                    {t('nav.brand')}
                </Link>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-widest uppercase rounded-full mb-3">
                            {t('login.badges_pro')}
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">{t('login.welcome_back')}</h1>
                        <p className="text-slate-500">{t('login.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('login.email_label')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-50 outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-medium text-slate-700">{t('login.password_label')}</label>
                                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">{t('login.forgot_password')}</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-50 outline-none transition-all font-medium text-slate-900 text-xl"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t('login.submit')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm">
                            {t('login.no_account')} <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 ml-1">{t('login.register_link')}</Link>
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Login;
