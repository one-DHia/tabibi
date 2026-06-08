import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Search, UserCheck, CalendarCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-800 group-hover:text-emerald-600'}`}>
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed max-w-2xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ConceptStep = ({ icon: Icon, title, desc, delay, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
    >
        <div className={`w-20 h-20 rounded-full ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-10 h-10 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 text-lg leading-relaxed">{desc}</p>
    </motion.div>
);

const Concept = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                <div className="w-full max-w-5xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-6">
                            {t('nav.how_it_works')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-display mb-6 leading-tight">
                            {t('concept.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                            {t('concept.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Explanation Block */}
            <section className="py-20">
                <div className="w-full max-w-[1200px] mx-auto px-4">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('concept.simple_title')}</h2>
                            <p className="text-lg text-slate-600">{t('concept.simple_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                            {/* Connector Lines (only visible on desktop) */}
                            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-emerald-100 -z-0"></div>

                            <ConceptStep
                                icon={Search}
                                title={t('concept.step_1_title')}
                                desc={t('concept.step_1_desc')}
                                color="bg-blue-500"
                                delay={0}
                            />
                            <ConceptStep
                                icon={UserCheck}
                                title={t('concept.step_2_title')}
                                desc={t('concept.step_2_desc')}
                                color="bg-purple-500"
                                delay={0.2}
                            />
                            <ConceptStep
                                icon={CalendarCheck}
                                title={t('concept.step_3_title')}
                                desc={t('concept.step_3_desc')}
                                color="bg-emerald-500"
                                delay={0.4}
                            />
                        </div>

                        <div className="mt-16 p-8 bg-slate-50 rounded-2xl text-center border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('concept.for_who_title')}</h3>
                            <p className="text-slate-600">{t('concept.for_who_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="w-full max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 text-center">{t('concept.faq_title')}</h2>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
                        <FAQItem question={t('concept.faq_1_q')} answer={t('concept.faq_1_a')} />
                        <FAQItem question={t('concept.faq_2_q')} answer={t('concept.faq_2_a')} />
                        <FAQItem question={t('concept.faq_3_q')} answer={t('concept.faq_3_a')} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Concept;
