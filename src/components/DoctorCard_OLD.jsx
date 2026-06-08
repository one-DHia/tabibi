import React, { useState } from 'react';
import { MapPin, Star, Calendar, Check, CreditCard, ArrowRight, Flag, AlertTriangle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import ReportModal from './ReportModal';

const DoctorCard = ({ doctor }) => {
    const [showPhone, setShowPhone] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { t } = useLanguage();
    const { isFavorite, toggleFavorite } = useFavorites();

    const isFav = isFavorite(doctor.id);

    // Find translation for specialty and city using keys
    const displaySpecialty = t(`specialties.${doctor?.specialty || 'general_practitioner'}`);
    const displayCity = t(`wilayas.${doctor?.city || 'algiers'}`);

    // Check availability of reports safely
    const reportCount = doctor?.reports?.length || 0;
    const isFlagged = reportCount > 5;

    const handleReportSubmit = async (reportData) => {
        try {
            const { submitReport } = await import('../services/doctorService'); // Dynamic import to avoid cycles or ensure freshness
            const { error } = await submitReport(reportData.doctorId, reportData.reason, reportData.details);

            if (error) {
                console.error("Report failed:", error);
                alert(t('report_error') || "Erreur lors de l'envoi du signalement.");
            } else {
                alert(t('report_submitted_thanks') || "Merci pour votre signalement. Nous allons vérifier ce profil.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex flex-col p-6 gap-6 bg-white rounded-[2rem] border shadow-sm hover:shadow-xl hover:processed-ring hover:ring-2 hover:ring-emerald-500/20 transition-all group h-full justify-between w-full relative ${isFlagged ? 'border-red-200 bg-red-50/30' : 'border-slate-100'
                    }`}
            >
                {/* Warning Overlay if Flagged */}
                {isFlagged && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-[1px] rounded-[2rem] z-10 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-red-600 font-bold mb-1">{t('warning_flagged') || "Avertissement"}</p>
                        <p className="text-xs text-gray-600">{t('doctor_not_recommended') || "Ce profil a reçu plusieurs signalements et n'est pas recommandé."}</p>
                    </div>
                )}

                {/* Favorite Button (Anatomical Heart) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(doctor.id);
                    }}
                    className="absolute top-4 left-4 z-20 transition-transform active:scale-95 group/heart"
                    title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFav ? "#e11d48" : "none"}
                        stroke={isFav ? "#e11d48" : "currentColor"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`w-7 h-7 ${isFav ? 'animate-heartbeat drop-shadow-md' : 'text-slate-300 hover:text-rose-500'}`}
                    >
                        {/* Simplified Anatomical Heart Shape */}
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        {/* Arteries decoration (visible on hover or fav) */}
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3" className={isFav ? "opacity-100" : "opacity-0 group-hover/heart:opacity-100"} />
                    </svg>
                </button>

                {isFlagged && (
                    <div className="absolute top-4 right-4 z-20">
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            High Risk
                        </span>
                    </div>
                )}

                {/* Report Button (Bottom Right of Image or similar) - Moved to avoid clutter */}
                {!isFlagged && (
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors z-20 p-1 opacity-0 group-hover:opacity-100"
                        title={t('report_profile') || "Signaler ce profil"}
                    >
                        <Flag className="w-4 h-4" />
                    </button>
                )}


                {/* Top Section */}
                <div className={`flex gap-5 ${isFlagged ? 'opacity-50 blur-[0.5px]' : ''}`}>
                    <div className="relative flex-shrink-0">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-inner"
                        />
                        <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-1 font-display truncate pe-2">
                            <Link to={`/doctor/${doctor.id}`} className="hover:text-emerald-600 transition-colors">
                                {doctor.name}
                            </Link>
                        </h3>
                        <p className="text-emerald-600 font-medium text-sm mb-2">{displaySpecialty}</p>

                        <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-3">
                            <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0 rtl:flip" />
                            <span className="truncate">{displayCity}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                <span className="text-sm font-bold text-slate-800">{doctor.rating}</span>
                            </div>
                            <span className="text-xs text-zinc-400 font-medium">({doctor.reviews} {t('doctor_card.reviews')})</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Details */}
                <div className={`flex flex-wrap gap-2 pt-4 border-t border-slate-50 ${isFlagged ? 'opacity-50' : ''}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-50 text-zinc-600 border border-zinc-100">
                        {t('doctor_card.consultation')}: <span className="text-zinc-900">{doctor.price}</span>
                    </span>
                </div>

                {/* Bottom Actions */}
                <div className={`flex flex-col gap-3 mt-2 ${isFlagged ? 'opacity-50 pointer-events-none' : ''}`}>
                    <button
                        onClick={() => setShowPhone(!showPhone)}
                        className={`w-full inline-flex items-center justify-center rounded-xl transition-all font-bold text-base py-3.5 shadow-lg active:scale-95 border group/btn ${showPhone
                            ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/10'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                            }`}
                    >
                        {showPhone ? (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-lg tracking-widest font-mono whitespace-nowrap"
                            >
                                {doctor.phone}
                            </motion.span>
                        ) : (
                            <span className="flex items-center gap-2 whitespace-nowrap">
                                {t('doctor_card.show_number')}
                            </span>
                        )}
                    </button>
                    <div className="flex gap-3">
                        <Link
                            to={`/doctor/${doctor.id}`}
                            className="flex-1 inline-flex items-center justify-center rounded-xl transition-colors font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 text-sm py-3 whitespace-nowrap"
                        >
                            {t('doctor_card.view_profile')}
                        </Link>
                        {/* Minimalist Share Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Dr. ${doctor.name} - Tabibi`,
                                        text: `Votre santé est précieuse. J'ai trouvé ce spécialiste recommandé sur Tabibi :`,
                                        url: window.location.origin + `/doctor/${doctor.id}`
                                    }).catch(console.error);
                                } else {
                                    // Fallback
                                    navigator.clipboard.writeText(window.location.origin + `/doctor/${doctor.id}`);
                                    alert("Lien copié !");
                                }
                            }}
                            className="w-12 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </motion.div>

            {showReportModal && (
                <ReportModal
                    doctor={doctor}
                    onClose={() => setShowReportModal(false)}
                    onSubmit={handleReportSubmit}
                />
            )}
        </>
    );
};
export default DoctorCard;
