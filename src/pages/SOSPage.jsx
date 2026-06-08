import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle, MapPin, Shield, Ambulance } from 'lucide-react';
import { doctors } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';

const SOSPage = () => {
    const { t } = useLanguage();

    // Filter emergency clinics
    const clinics = doctors.filter(d => d.isEmergency);

    const EmergencyCard = ({ number, icon: Icon, label, color }) => (
        <motion.a
            href={`tel:${number}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl ${color} text-white shadow-xl shadow-red-500/10 cursor-pointer transition-all`}
        >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Icon size={32} className="text-white" />
            </div>
            <span className="text-4xl font-bold font-display mb-1">{number}</span>
            <span className="text-sm font-medium opacity-90 uppercase tracking-widest">{label}</span>
        </motion.a>
    );

    return (
        <div className="min-h-screen bg-red-50">
            <Navbar />

            <div className="pt-28 pb-20 px-4 md:px-6 max-w-[1400px] mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100/50 text-red-600 rounded-full font-bold text-sm uppercase tracking-wider mb-6 border border-red-200"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        {t('sos.mode')}
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-display mb-4">
                        {t('sos.title_part1')} <span className="text-red-500">{t('sos.title_part2')}</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                        {t('sos.description')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
                    <EmergencyCard
                        number="14"
                        label={t('sos.civil_protection')}
                        icon={Shield}
                        color="bg-red-500"
                    />
                    <EmergencyCard
                        number="17"
                        label={t('sos.police')}
                        icon={AlertTriangle}
                        color="bg-slate-800"
                    />
                    <EmergencyCard
                        number="1548"
                        label={t('sos.gendarmerie')}
                        icon={Phone}
                        color="bg-emerald-700"
                    />
                    <EmergencyCard
                        number="SAMU"
                        label={t('sos.ambulance')}
                        icon={Ambulance}
                        color="bg-blue-600"
                    />
                </div>

                {/* 24/7 Clinics Section */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            {t('sos.clinics_title')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clinics.map(clinic => (
                            <DoctorCard key={clinic.id} doctor={clinic} />
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Warning */}
            <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white p-2 text-center text-xs font-bold uppercase tracking-widest z-40">
                {t('sos.vital_emergency')}
            </div>
        </div>
    );
};

export default SOSPage;
