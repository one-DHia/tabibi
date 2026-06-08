import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Stethoscope, Bot, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Chatbot = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    // Initialize with a multilingual welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    text: "Bonjour ! je suis Dr. Tabibi (IA). Comment puis-je vous aider aujourd'hui ?\nHello! How can I help you?\nمرحبا! كيف يمكنني مساعدتك؟"
                }
            ]);
        }
    }, []);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Simple Intent Recognition Logic
    const detectIntent = (text) => {
        const lowerText = text.toLowerCase();

        const keywords = {
            cardiologist: ['coeur', 'heart', 'cardio', 'poitrine', 'chest', 'qalb', 'douleur', 'palpitation', 'tension'],
            dentist: ['dent', 'tooth', 'teeth', 'bouche', 'asnan', 'fomm', 'suna', 'gencive', 'mâchoire'],
            pediatrician: ['enfant', 'child', 'bebe', 'baby', 'wildi', 'sghir', 'fils', 'fille', 'vaccin'],
            ophthalmologist: ['oeil', 'eye', 'vision', 'lunette', 'ain', 'chouf'],
            dermatologist: ['peau', 'skin', 'bouton', 'jild', 'hab', 'acné', 'eczéma'],
            orthopedist: ['os', 'bone', 'dos', 'back', 'pied', 'foot', 'rijl', 'dhahri', 'fracture', 'genou'],
            gynecologist: ['femme', 'woman', 'enceinte', 'pregnant', 'bebe'],
            general_practitioner: ['fievre', 'fever', 'mal', 'pain', 'hmayem', 'grippe', 'flu', 'fatigue', 'tête']
        };

        // Detect Language
        let lang = 'fr';
        if (/[\u0600-\u06FF]/.test(text)) lang = 'ar'; // Regex for Arabic characters
        else if (lowerText.match(/\b(hello|help|pain|doctor)\b/)) lang = 'en';

        // Check for specialties
        for (const [specialty, words] of Object.entries(keywords)) {
            if (words.some(word => lowerText.includes(word))) {
                return { specialty, lang };
            }
        }

        return { specialty: null, lang };
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            const { specialty, lang } = detectIntent(userMsg.text);
            let botResponse = {};

            if (specialty) {
                // Found a match
                const responses = {
                    fr: `Je comprends que vous avez un problème lié à : ${specialty}. Je vous recommande de consulter un spécialiste immédiatemment.`,
                    en: `I understand you have an issue related to: ${specialty}. I recommend seeing a specialist immediately.`,
                    ar: `أفهم أن لديك مشكلة تتعلق بـ: ${specialty}. أنصحك بزيارة طبيب مختص فوراً.`
                };

                botResponse = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: responses[lang] || responses.fr,
                    action: {
                        label: lang === 'ar' ? 'عرض الأطباء' : (lang === 'en' ? 'View Doctors' : 'Voir les médecins'),
                        link: `/search?q=${specialty}`
                    }
                };
            } else {
                // No match (Fallback)
                const fallbacks = {
                    fr: "Je ne suis pas sûr de comprendre. Pouvez-vous décrire vos symptômes (ex: 'mal aux dents', 'fièvre') ?",
                    en: "I'm not sure I understand. Can you describe your symptoms (e.g., 'toothache', 'fever')?",
                    ar: "لست متأكداً من أنني فهمت. هل يمكنك وصف الأعراض (مثلاً: 'ألم أسنان'، 'حمى')؟"
                };

                botResponse = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: fallbacks[lang] || fallbacks.fr
                };
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="pointer-events-auto bg-white/90 backdrop-blur-xl w-[350px] md:w-[380px] h-[500px] md:h-[600px] mb-4 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col font-sans origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.5),transparent)] animate-pulse" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-full flex items-center justify-center relative shadow-lg">
                                    <Bot className="w-6 h-6 text-white" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Dr. Tabibi</h3>
                                    <p className="text-emerald-400 text-xs font-medium">Assistant IA • Multilangue</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed ${msg.type === 'user'
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-line">{msg.text}</p>

                                        {/* Action Button if available */}
                                        {msg.action && (
                                            <Link
                                                to={msg.action.link}
                                                onClick={() => setIsOpen(false)}
                                                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors w-full justify-center shadow-lg shadow-emerald-500/20"
                                            >
                                                {msg.action.label} <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-4 shadow-sm flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={t('chatbot.placeholder') || "Décrivez vos symptômes..."}
                                    className="w-full pl-5 pr-12 py-3.5 bg-slate-100 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1.5 p-2 bg-slate-900 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-2">
                                I.A. expérimentale. Consultez toujours un médecin.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB (Floating Action Button) */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all bg-slate-900 relative group`}
            >
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping group-hover:bg-emerald-500/40"></div>

                {isOpen ? (
                    <X className="w-8 h-8 text-white relative z-10" />
                ) : (
                    <>
                        <Bot className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full z-20 flex items-center justify-center">
                            <span className="w-full h-full bg-red-500 rounded-full animate-ping absolute opacity-75"></span>
                        </span>
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
