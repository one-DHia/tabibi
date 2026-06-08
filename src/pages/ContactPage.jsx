import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    return (
        <div className="pt-32 px-4 text-center">
            <h1 className="text-3xl font-bold">Contact Page Debug</h1>
            <p>If you see this, the Contact route is working.</p>
        </div>
    );
};

export default Contact;
