import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import DoctorMap from '../components/Map/DoctorMap';
import { wilayas, specialties, doctors as mockDoctors } from '../data/mockData';
import { Search as SearchIcon, Filter, MapPin, Stethoscope, ChevronDown, X, Map as MapIcon, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

import { getDoctors } from '../services/doctorService';
import SEO from '../components/SEO';

const Search = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialCity = searchParams.get('city') || '';

    const { t } = useLanguage();
    const [specialty, setSpecialty] = useState(initialQuery);
    const [wilaya, setWilaya] = useState(initialCity);
    const [availability, setAvailability] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Async Data State
    const [doctors, setDoctors] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Fetch Data Effect
    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true);
            try {
                // Fetch filtered and paginated data from service
                // This prepares us for Supabase where filtering happens on server
                const { data, count } = await getDoctors({
                    page: currentPage,
                    itemsPerPage,
                    specialty,
                    city: wilaya,
                    availability
                });

                setDoctors(data);
                setTotalResults(count);
            } catch (err) {
                console.error("Failed to fetch doctors", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchDocs();
        }, 300); // Debounce typing/selecting

        return () => clearTimeout(timer);
    }, [specialty, wilaya, availability, currentPage]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [specialty, wilaya, availability]);

    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Stagger container for results
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 // Faster stagger for better feel
            }
        }
    };


    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-20">
            <SEO
                title={specialty || wilaya ? `${specialty ? t('specialties.' + specialty) : 'Médécin'} ${wilaya ? 'à ' + t('wilayas.' + wilaya) : ''}` : t('search.find_specialist')}
                description={t('search.subtitle')}
            />
            <div className="container max-w-[1600px] mx-auto px-4 md:px-6">

                {/* Header Section - Centered & Spacious */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t('search.verified_directory')}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 font-display tracking-tight mb-4"
                    >
                        {t('search.find_specialist')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto"
                    >
                        {t('search.subtitle')}
                    </motion.p>
                </div>

                {/* Top Filter Bar - Sticky & Horizontal */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-24 z-40 mb-10 -mx-4 px-4 md:mx-0 md:px-0"
                >
                    <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar max-w-5xl mx-auto rtl:flex-row-reverse">

                        {/* Specialty Dropdown Pill */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-white rounded-xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer min-w-[200px]">
                                <Stethoscope size={18} className="text-emerald-600" />
                                <select
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="appearance-none bg-transparent w-full text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                                >
                                    <option value="">{t('search.all_specialties')}</option>
                                    {specialties.map((spec, idx) => (
                                        <option key={idx} value={spec}>{t(`specialties.${spec}`)}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="text-slate-400 pointer-events-none absolute right-4 rtl:left-4 rtl:right-auto" />
                            </div>
                        </div>

                        {/* Location Dropdown Pill */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-white rounded-xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer min-w-[200px]">
                                <MapPin size={18} className="text-emerald-600" />
                                <select
                                    value={wilaya}
                                    onChange={(e) => setWilaya(e.target.value)}
                                    className="appearance-none bg-transparent w-full text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                                >
                                    <option value="">{t('search.all_wilayas')}</option>
                                    {wilayas.map((wil, idx) => (
                                        <option key={idx} value={wil}>{t(`wilayas.${wil}`)}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="text-slate-400 pointer-events-none absolute right-4 rtl:left-4 rtl:right-auto" />
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Liste"
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Carte"
                            >
                                <MapIcon size={20} />
                            </button>
                        </div>

                        {/* Active Filters Summary / Reset */}
                        {(specialty || wilaya) && (
                            <button
                                onClick={() => { setSpecialty(''); setWilaya(''); }}
                                className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors ml-auto"
                            >
                                <X size={16} />
                                {t('search.reset')}
                            </button>
                        )}

                        {/* Results Count pill */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 ml-auto md:ml-0">
                            {totalResults} <span className="font-medium text-slate-400">{t('search.results_found')}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid or Map - Full Width */}
                <div className="w-full">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-400 font-medium animate-pulse">{t('chatbot.is_typing')}</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'map' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-20"
                                >
                                    <DoctorMap doctors={doctors} />
                                </motion.div>
                            ) : (
                                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[500px]">
                                    <AnimatePresence mode="wait">
                                        {doctors.length > 0 ? (
                                            <motion.div
                                                key={currentPage} // Animate on page change
                                                variants={container}
                                                initial="hidden"
                                                animate="show"
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 col-span-full"
                                            >
                                                {doctors.map((doctor) => (
                                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-300 min-h-[500px]"
                                            >
                                                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
                                                    <SearchIcon className="text-slate-400 w-12 h-12" />
                                                </div>
                                                <h3 className="text-3xl font-bold text-slate-900 mb-4">{t('search.no_results_title')}</h3>
                                                <p className="text-xl text-slate-500 text-center max-w-md mb-10">
                                                    {t('search.no_results_desc')}
                                                </p>
                                                <button
                                                    onClick={() => { setSpecialty(''); setWilaya(''); }}
                                                    className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 text-lg"
                                                >
                                                    {t('search.suggest_reset')}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Pagination Controls - Only show in List view or if map pagination is desired (usually map shows all or filtered set) */}
                            {viewMode === 'list' && totalResults > itemsPerPage && (
                                <div className="flex justify-center items-center gap-4 mt-12 mb-20">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center gap-2"
                                    >
                                        ← {t('signup.back')}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {/* Simple page numbers: Show Current and surrounding */}
                                        <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20">
                                            {currentPage}
                                        </span>
                                        <span className="text-slate-400 font-medium">/</span>
                                        <span className="text-slate-600 font-medium">{totalPages}</span>
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center gap-2"
                                    >
                                        {t('signup.next')} →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Search;
