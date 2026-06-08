// ============================================================
// ⛔ DISABLED — Database Seeder (Security Risk)
// ============================================================
// This page could delete ALL data from the database.
// It has been neutered for security.
// 
// To seed data, use the SQL script instead:
//   supabase/complete_setup.sql → Section 8 (Seed Data)
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const SeedPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Seeder Désactivé</h1>
                <p className="text-slate-500 mb-6">
                    Cette page a été désactivée pour des raisons de sécurité.
                    Utilisez le script SQL pour injecter les données de test.
                </p>
                <code className="block bg-slate-900 text-emerald-400 p-4 rounded-xl text-sm mb-6 text-left">
                    supabase/complete_setup.sql → Section 8
                </code>
                <Link 
                    to="/" 
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default SeedPage;
