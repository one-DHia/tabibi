import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Load from local storage or default to 'fr'
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('tabibi_lang') || 'fr';
    });

    useEffect(() => {
        localStorage.setItem('tabibi_lang', language);

        // Handle RTL for Arabic
        if (language === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = language;
        }
    }, [language]);

    const changeLanguage = (lang) => {
        if (['fr', 'en', 'ar'].includes(lang)) {
            setLanguage(lang);
        }
    };

    // Translation helper function
    // Supports nested keys like 'hero.title'
    // Supports variable replacement like 'Found {count} results'
    const t = (key, variables = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        if (!value) {
            console.warn(`Missing translation for key: ${key} in language: ${language}`);
            return key; // Fallback to key
        }

        // Replace variables
        Object.keys(variables).forEach(varName => {
            value = value.replace(`{${varName}}`, variables[varName]);
        });

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
