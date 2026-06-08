import React from 'react';
import { Phone, Ambulance, ShieldAlert, HeartPulse, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SOS = () => {
    const { t } = useLanguage();

    const emergencyNumbers = [
        { number: "14", label: "Protection Civile", icon: ShieldAlert, color: "bg-red-500", desc: "Incendies, accidents, urgences vitales" },
        { number: "17", label: "Police Secours", icon: ShieldAlert, color: "bg-blue-600", desc: "Urgence police en zone urbaine" },
        { number: "1055", label: "Gendarmerie Nationale", icon: ShieldAlert, color: "bg-emerald-700", desc: "Urgence gendarmerie en zone rurale/autoroute" },
        { number: "115", label: "SAMU", icon: Ambulance, color: "bg-green-600", desc: "Urgence médicale (Service d'Aide Médicale Urgente)" },
        { number: "3030", label: "Allo Tabibi COVID/Grippe", icon: HeartPulse, color: "bg-teal-500", desc: "Orientation & Information sanitaire" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Red Pulse for Urgency */}
            <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-red-100/50 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                    {t('common.return_home') || "Retour à l'accueil"}
                </Link>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow ring-8 ring-red-50">
                        <HeartPulse className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 font-display mb-2 text-red-600">URGENCE SOS</h1>
                    <p className="text-slate-600 text-lg">Appel gratuit 24h/24 et 7j/7. En cas de doute, appelez le 14.</p>
                </div>

                <div className="space-y-4">
                    {emergencyNumbers.map((item, idx) => (
                        <a
                            key={idx}
                            href={`tel:${item.number}`}
                            className="group flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 w-2 ${item.color} group-hover:w-full transition-all duration-300 opacity-5`} />

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${item.color} text-white shadow-lg shadow-${item.color}/30 text-2xl font-bold`}>
                                <Phone className="w-8 h-8 fill-current animate-pulse" />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 leading-none mb-1 group-hover:text-red-600 transition-colors">{item.number}</h2>
                                <h3 className="text-lg font-bold text-slate-700">{item.label}</h3>
                                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                            </div>

                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 text-center">
                    <p className="text-yellow-800 font-bold text-sm">⚠️ Ne raccrochez pas avant que l'opérateur ne vous le dise.</p>
                </div>
            </div>
        </div>
    );
};

export default SOS;
