import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ReportModal = ({ doctor, onClose, onSubmit }) => {
    const { t } = useLanguage();
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    const reasons = [
        'wrong_number', // Numéro erroné
        'retired',      // Retraité/N'exerce plus
        'does_not_exist', // N'existe pas
        'other'         // Autre
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            doctorId: doctor.id,
            reason: reason === 'other' ? customReason : reason,
            timestamp: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('report_modal.title')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {t('report_modal.description')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            {reasons.map((r) => (
                                <label key={r} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {t(`report_modal.${r}`)}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {reason === 'other' && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder={t('report_modal.describe_placeholder')}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none h-24 resize-none"
                                required
                            />
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                            >
                                {t('report_modal.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={!reason}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('report_modal.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
