import React, { useState } from 'react';
import { Search, MapPin, ArrowUpRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';
import FloatingElements from './FloatingElements';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        navigate(`/search?q=${searchTerm}&city=${location}`);
    };

    return (
        <div className="relative pt-24 pb-20 px-4 md:px-6 w-full min-h-[85vh] flex items-center overflow-hidden bg-[#fafbfc]">

            {/* AMBIENT MESH GRADIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-teal-100/40 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] bg-indigo-50/50 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-[1400px] mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Typography & Search */}
                    <div className="flex flex-col justify-center text-left max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-xs font-bold text-teal-600 tracking-wider uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                                {t('hero.platform_badge')}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 font-display text-slate-900"
                        >
                            {t('hero.title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">{t('hero.title_2')}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-lg md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed mb-10"
                        >
                            {t('hero.subtitle_2')}
                        </motion.p>

                        {/* Search Bar - Clean White Glass */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full"
                        >
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row p-2 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/40 gap-2 ring-4 ring-slate-50/50">
                                <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                                    <Search className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('hero.search_placeholder')}
                                        className="w-full pl-10 pr-2 py-1 bg-transparent text-slate-900 placeholder-slate-400 outline-none font-semibold text-lg h-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 px-6 py-3 relative group">
                                    <MapPin className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('hero.city_placeholder')}
                                        className="w-full pl-10 pr-2 py-1 bg-transparent text-slate-900 placeholder-slate-400 outline-none font-semibold text-lg h-full"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div className="p-1">
                                    <MagneticButton>
                                        <button type="submit" className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-[1.8rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                                            {t('hero.search_button')} <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </MagneticButton>
                                </div>
                            </form>
                            {/* Stats under search */}
                            <div className="flex gap-8 mt-8 px-4">
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">10k+</p>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t('hero.stats.patients')}</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">5k+</p>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t('hero.stats.doctors')}</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">4.9</p>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t('hero.stats.rating')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Premium Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block relative h-full min-h-[600px] flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-lg mx-auto aspect-square">
                            {/* Decorative rings/glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />

                            {/* Main Hero Image with Glass Border */}
                            <div className="relative z-10 rounded-[3rem] overflow-hidden border-[8px] border-white/50 shadow-2xl shadow-teal-900/10 rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                                <img
                                    src="/hero_image.png"
                                    alt="Tabibi Doctor Team"
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Card: Experience */}
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white flex items-center gap-4 animate-bounce-slow">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                        <Star className="w-6 h-6 fill-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Top Rated</p>
                                        <p className="text-xs text-slate-500">Best Medical Service</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
