import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById } from '../services/doctorService';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Share2, MapPin, Check, CreditCard, Clock, ShieldCheck, Star, Calendar, Phone, AlertCircle, QrCode } from 'lucide-react';
import SEO from '../components/SEO';

const DoctorProfile = () => {
    const { id } = useParams();
    const { t } = useLanguage();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock calendar state
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        const loadDoc = async () => {
            setLoading(true);
            try {
                const { data } = await getDoctorById(id);
                setDoctor(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadDoc();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <h1 className="text-2xl font-bold mb-4">{t('search.no_results_title')}</h1>
                <Link to="/search" className="btn btn-primary">{t('verification.return_home')}</Link>
            </div>
        );
    }

    const handleBooking = (slot) => {
        setSelectedSlot(slot);
        setShowConfirmation(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24">
            <SEO
                title={`Dr. ${doctor.name} - ${t('specialties.' + doctor.specialty)}`}
                description={`${t('specialties.' + doctor.specialty)} à ${t('wilayas.' + doctor.city)}. Prenez rendez-vous en ligne.`}
                image={doctor.image}
            />
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 z-0 pointer-events-none" />

            <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex text-sm font-medium text-slate-500 mb-8 items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/" className="hover:text-emerald-600 transition-colors">{t('common.home')}</Link>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180 flex-shrink-0" />
                    <Link to="/search" className="hover:text-emerald-600 transition-colors">{t('nav.search')}</Link>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180 flex-shrink-0" />
                    <span className="text-slate-900 font-semibold">{t(`specialties.${doctor.specialty}`)}</span>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180 flex-shrink-0" />
                    <span className="text-slate-600">{doctor.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Main Profile Info */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* 1. HERO CARD (Glass) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl shadow-slate-200/50 relative overflow-hidden"
                        >
                            {/* Actions */}
                            <div className="absolute top-6 right-6 flex gap-3 z-20 rtl:right-auto rtl:left-6">
                                <button className="p-3 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button onClick={() => setShowShareModal(true)} className="p-3 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                <div className="relative group mx-auto md:mx-0">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/20 border-4 border-white transition-transform duration-500 group-hover:scale-105">
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 font-display tracking-tight">{doctor.name}</h1>
                                        {/* Verified Badge */}
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-200 w-fit mx-auto md:mx-0">
                                            <ShieldCheck className="w-3 h-3" /> {t('common.verified')}
                                        </span>
                                    </div>

                                    <p className="text-xl text-emerald-600 font-medium mb-4">{t(`specialties.${doctor.specialty}`)}</p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {doctor.address}, {t(`wilayas.${doctor.city}`)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            {doctor.rating} <span className="text-amber-300 font-normal">({doctor.reviews} avis)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100/50">
                                            <Check className="w-4 h-4" /> Conventionné
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100/50">
                                            <CreditCard className="w-4 h-4" /> Carte Chifa
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. ABOUT & INFO */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-emerald-500" />
                                {t('doctor_profile.presentation')}
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-8">
                                {t('doctor_profile.presentation_text', { name: doctor.name.replace('Dr. ', '').replace('Pr. ', ''), specialty: t(`specialties.${doctor.specialty}`) })}
                                <br /><br />
                                Cabinet moderne équipé des dernières technologies pour assurer un diagnostic précis et un suivi de qualité.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" /> Horaires d'ouverture
                                    </h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex justify-between"><span>Samedi - Jeudi</span> <span className="font-bold text-slate-900">08:00 - 16:30</span></li>
                                        <li className="flex justify-between text-slate-400"><span>Vendredi</span> <span>Fermé</span></li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-purple-500" /> Tarifs
                                    </h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex justify-between"><span>Consultation</span> <span className="font-bold text-emerald-600">{doctor.price}</span></li>
                                        <li className="flex justify-between"><span>Téléconsultation</span> <span className="font-bold text-emerald-600">1500 DA</span></li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. REVIEWS (New!) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    Avis Patients <span className="text-slate-400 text-sm font-normal">({doctor.reviews})</span>
                                </h2>
                                <button className="text-sm font-bold text-emerald-600 hover:underline">Voir tout</button>
                            </div>

                            <div className="space-y-6">
                                {[1, 2].map((review, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                            {i === 0 ? 'A' : 'M'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900">{i === 0 ? 'Amine K.' : 'Meriem B.'}</span>
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm">Très bon médecin, à l'écoute et très professionnel. Le cabinet est propre et l'accueil est chaleureux.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* 4. MAP */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-2 border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="w-full h-80 rounded-[1.2rem] bg-slate-100 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Algiers&zoom=14&size=800x400&sensor=false')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end p-6">
                                    <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{t('common.medical_cabinet')}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1">{doctor.address}</p>
                                        </div>
                                        <button className="ml-auto btn btn-sm btn-primary rounded-lg text-xs">Itinéraire</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:w-1/3 relative">
                        <div className="sticky top-28 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                            >
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                    <Calendar className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-lg font-bold text-slate-900">{t('doctor_profile.book_title')}</h3>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t('doctor_profile.reason_label')}</label>
                                    <select className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all">
                                        <option>{t('doctor_profile.reason_consultation')}</option>
                                        <option>{t('doctor_profile.reason_new_patient')}</option>
                                        <option>{t('doctor_profile.reason_emergency')}</option>
                                    </select>
                                </div>

                                {/* Calendar Strip */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                                        <span className="font-bold text-slate-900">Janvier 2024</span>
                                        <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-4 h-4" /></button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {[
                                            { d: "Lun", n: "12" }, { d: "Mar", n: "13" }, { d: "Mer", n: "14" }, { d: "Jeu", n: "15" }
                                        ].map((day, i) => (
                                            <button key={i} className={`flex flex-col items-center p-3 rounded-2xl border ${i === 1 ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'} transition-all`}>
                                                <span className="text-xs font-medium mb-1 opacity-80">{day.d}</span>
                                                <span className="font-bold text-lg">{day.n}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:30", "14:00", "14:30"].map((time, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleBooking(time)}
                                                className="py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white transition-all text-sm font-bold border border-transparent hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium mb-4">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Réservation 100% Gratuite & Sécurisée
                                    </p>
                                    {/* Call Action */}
                                    <button className="w-full py-4 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" /> Appeler le secrétariat
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal (Premium) */}
            {showConfirmation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowConfirmation(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative z-10 overflow-hidden"
                    >
                        {/* Confetti Decoration could go here */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-blue-500" />

                        <div className="text-center mb-8 pt-4">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/50 animate-bounce-slow">
                                <Check className="w-12 h-12 text-emerald-500" strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">{t('doctor_profile.confirm_title')}</h2>
                            <p className="text-slate-500 leading-relaxed">
                                {t('doctor_profile.confirm_message', { name: doctor.name, time: selectedSlot })}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-8 text-sm text-slate-600 border border-slate-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Share2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="mt-1">{t('doctor_profile.sms_confirmation')}</p>
                        </div>

                        <button
                            onClick={() => setShowConfirmation(false)}
                            className="w-full btn btn-primary py-4 text-lg font-bold shadow-xl shadow-emerald-500/20 rounded-xl"
                        >
                            {t('doctor_profile.finish')}
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Share / QR Code Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">Partager ce profil</h2>

                        <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-inner mb-6 inline-block">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}&color=0f172a`}
                                alt="QR Code"
                                className="w-40 h-40 mix-blend-multiply"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Scannez pour prendre rendez-vous avec {doctor.name}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Lien copié !');
                                }}
                                className="btn btn-outline py-3 text-sm flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Copier Lien
                            </button>
                            <a
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(window.location.href)}`}
                                download="qr-code.png"
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <QrCode className="w-4 h-4" /> Télécharger
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default DoctorProfile;
