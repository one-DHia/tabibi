import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Calendar, Shield, Activity, Heart, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingElements = () => {
    const { t } = useLanguage();

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center pointer-events-none select-none perspective-[2000px]">

            {/* 1. Main Card: Doctor Profile (Center) */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="absolute z-20 w-72 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl shadow-teal-900/10 border border-white/60 transform preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-100 to-blue-50 p-1">
                        <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200" alt="Doctor" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Dr. Amine</h3>
                        <p className="text-teal-600 text-xs font-semibold uppercase tracking-wide">{t('hero.floating.cardiologist')}</p>
                        <div className="flex text-yellow-500 gap-0.5 mt-1">
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Info Rows */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                        <Calendar className="w-5 h-5 text-teal-500" />
                        <div>
                            <p className="text-xs text-slate-400 font-medium">{t('hero.floating.next_available')}</p>
                            <p className="text-sm font-bold text-slate-700">{t('hero.floating.today_time')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-xs text-slate-400 font-medium">{t('hero.floating.status')}</p>
                            <p className="text-sm font-bold text-slate-700">{t('hero.floating.verified_pro')}</p>
                        </div>
                    </div>
                </div>

                {/* Mock Button */}
                <div className="w-full py-3 bg-slate-900 text-white text-center rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20">
                    {t('hero.floating.book_btn')}
                </div>
            </motion.div>


            {/* 2. Floating Notification (Top Right) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0, y: -10 }}
                transition={{
                    duration: 0.8, delay: 0.2,
                    y: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                className="absolute top-[15%] right-[0%] z-30 bg-white p-4 rounded-2xl shadow-xl shadow-teal-900/10 border border-white/60 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">{t('hero.floating.success')}</p>
                    <p className="text-sm font-bold text-slate-800">{t('hero.floating.confirmed')}</p>
                </div>
            </motion.div>


            {/* 3. Floating Stats (Bottom Left) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: 10 }}
                transition={{
                    duration: 0.8, delay: 0.4,
                    y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                className="absolute bottom-[20%] left-[0%] z-10 bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/40"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-teal-700">{t('hero.floating.live_activity')}</span>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500`}>U{i}</div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
                </div>
            </motion.div>

            {/* 4. Extra Floating Badges for Complexity */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12"
            >
                <Heart className="w-6 h-6 text-rose-500 fill-current" />
            </motion.div>

            {/* Decorative Blur Blobs behind cards */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/20 blur-[80px] rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full" />
            </div>

        </div>
    );
};

export default FloatingElements;
