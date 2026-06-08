import React, { useState } from 'react';
import {
    MapPin, Star, Phone, ArrowRight, Share2, AlertTriangle, Heart, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
// import { useFavorites } from '../hooks/useFavorites';
import ReportModal from './ReportModal';
import { submitReport } from '../services/doctorService';

const DoctorCard = ({ doctor }) => {
    // Hooks
    const { t } = useLanguage();
    const isFavorite = () => false;
    const toggleFavorite = () => console.log('Toggle fav');
    const [showNumber, setShowNumber] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    // Defense against missing data
    if (!doctor) return null;

    // Derived Data
    const isFav = false;
    const isFlagged = (doctor?.reports?.length || 0) > 5;

    // Translation Fallbacks (Mocked)
    const specialtyName = doctor.specialty;
    const cityName = doctor.city;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`
                relative group flex flex-col bg-white rounded-3xl overflow-hidden 
                border transition-all duration-300
                ${isFlagged
                    ? 'border-red-200 shadow-red-100'
                    : 'border-slate-100 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10'
                }
            `}
        >

            {/* --- HEADER IMAGE SECTION --- */}
            <div className="relative h-28 bg-slate-50 overflow-hidden">
                {/* Background Blur Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-110"
                    style={{ backgroundImage: `url(${doctor.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />

                {/* Actions (Top Right) */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {/* Share */}
                    <button
                        className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                        <Share2 size={16} />
                    </button>

                    {/* Report (Shield) */}
                    <button
                        onClick={() => setIsReportOpen(true)}
                        className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Signaler ce médecin"
                    >
                        <ShieldAlert size={16} />
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="px-6 pb-6 -mt-12 relative z-10 flex flex-col flex-grow">

                {/* Avatar & Heart */}
                <div className="flex justify-between items-end mb-4">
                    <div className="relative">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className={`
                                w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md
                                ${isFlagged ? 'grayscale opacity-80' : ''}
                            `}
                        />
                        <div className={`
                            absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white
                            ${isFlagged ? 'bg-red-500' : 'bg-emerald-500'}
                        `} />
                    </div>

                    {/* Favorite Heart */}
                    <button
                        className="p-2 mb-1 rounded-full hover:bg-red-50 transition-colors group/heart"
                    >
                        <Heart
                            size={24}
                            className={`
                                transition-all duration-300
                                ${isFav ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 group-hover/heart:text-red-400'}
                            `}
                        />
                    </button>
                </div>

                {/* Info */}
                <div className="mb-4">
                    {isFlagged && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold mb-2">
                            <AlertTriangle size={12} />
                            Warning
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 flex items-center gap-1">
                        {doctor.name}
                        {doctor.is_verified && (
                            <ShieldCheck size={16} className="text-blue-500 fill-blue-50" />
                        )}
                    </h3>
                    <p className="text-emerald-600 font-medium text-sm mb-3">
                        {t(`specialties.${doctor.specialty}`)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400" />
                            {t(`wilayas.${doctor.city}`)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-slate-700">{doctor.rating}</span>
                            <span className="text-xs">({doctor.reviews})</span>
                        </div>
                    </div>
                </div>

                {/* Price Tag */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-sm mb-4">
                    <span className="text-slate-400 font-medium">{t('doctor_card.consultation')}</span>
                    <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
                        {doctor.price}
                    </span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setShowNumber(!showNumber)}
                        className={`
                            flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                            ${showNumber
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }
                        `}
                    >
                        <Phone size={16} />
                        {showNumber ? doctor.phone : t('doctor_card.call')}
                    </button>

                    <Link
                        to={`/doctor/${doctor.id}`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                        <span>{t('doctor_card.view')}</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            {/* --- REPORT MODAL --- */}
            {isReportOpen && (
                <ReportModal
                    doctor={doctor}
                    onClose={() => setIsReportOpen(false)}
                    onSubmit={async (reportData) => {
                        const { error } = await submitReport(doctor.id, reportData.reason, "Signalement via l'interface utilisateur.");
                        if (error) {
                            console.error(error);
                            alert("Erreur lors de la soumission du signalement. Connectez-vous si nécessaire.");
                        } else {
                            alert("Merci, votre signalement a été enregistré pour modération.");
                        }
                    }}
                />
            )}
        </motion.div>
    );
};

export default DoctorCard;
