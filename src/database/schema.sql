-- ============================================================
-- TABIBI v2.0 — Réinitialisation Complète & Schéma Définitif
-- ============================================================
-- Ce script supprime TOUT l'ancien système (anciens annuaires,
-- tables obsolètes) et recrée l'architecture B2B propre.
-- ============================================================

-- 0. Nettoyage total de l'ancien système (DROP CASCADE)
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS slot_locks CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS working_hours CASCADE;
DROP TABLE IF EXISTS cabinets CASCADE;

-- Extension requise pour les identifiants UUID sécurisés
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Table des Cabinets Médicaux
-- ============================================================
CREATE TABLE cabinets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================================
-- 2. Configuration des Horaires de Travail
-- ============================================================
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabinet_id UUID NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    slot_duration_minutes INTEGER DEFAULT 30,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    is_open BOOLEAN DEFAULT TRUE,
    open_time TEXT NOT NULL, -- e.g. "08:30"
    close_time TEXT NOT NULL, -- e.g. "16:30"
    break_start TEXT,         -- e.g. "12:00"
    break_end TEXT,           -- e.g. "13:00"
    UNIQUE(cabinet_id, day_of_week)
);

-- ============================================================
-- 3. Table des Rendez-vous (Appointments)
-- ============================================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabinet_id UUID NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_whatsapp TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    reminder_24h_sent BOOLEAN DEFAULT FALSE,
    reminder_2h_sent BOOLEAN DEFAULT FALSE,
    reminder_24h_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_2h_at TIMESTAMP WITH TIME ZONE NOT NULL,
    secure_token TEXT UNIQUE NOT NULL,
    device_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(cabinet_id, appointment_date, appointment_time)
);

-- ============================================================
-- 4. Verrouillage Temporaire des Créneaux (Anti-Conflit 15 min)
-- ============================================================
CREATE TABLE slot_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabinet_id UUID NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    device_id TEXT NOT NULL,
    locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(cabinet_id, slot_date, slot_time)
);

-- ============================================================
-- 5. Index de Performance pour Requêtes Temps Réel
-- ============================================================
CREATE INDEX idx_cabinets_slug ON cabinets(slug);
CREATE INDEX idx_appointments_lookup ON appointments(cabinet_id, appointment_date, status);
CREATE INDEX idx_appointments_reminders ON appointments(status, reminder_24h_sent, reminder_2h_sent);
CREATE INDEX idx_slot_locks_active ON slot_locks(cabinet_id, slot_date, locked_until);

-- ============================================================
-- 6. Sécurité Niveau Ligne (Row Level Security - RLS)
-- ============================================================
ALTER TABLE cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_locks ENABLE ROW LEVEL SECURITY;

-- Politiques Cabinets : Lecture publique (pour page réservation), modification par le médecin propriétaire
CREATE POLICY "Lecture publique des cabinets" ON cabinets FOR SELECT USING (true);
CREATE POLICY "Gestion par le médecin" ON cabinets FOR ALL USING (auth.uid() = user_id);

-- Politiques Horaires : Lecture publique, modification par le propriétaire
CREATE POLICY "Lecture publique des horaires" ON working_hours FOR SELECT USING (true);
CREATE POLICY "Gestion horaires par le médecin" ON working_hours FOR ALL 
USING (cabinet_id IN (SELECT id FROM cabinets WHERE user_id = auth.uid()));

-- Politiques Rendez-vous : Création ouverte (patients), consultation et annulation par le cabinet
CREATE POLICY "Prise de rendez-vous ouverte" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestion RDV par le cabinet" ON appointments FOR ALL 
USING (cabinet_id IN (SELECT id FROM cabinets WHERE user_id = auth.uid()));

-- Politiques Verrous : Gestion ouverte pour la réservation en temps réel
CREATE POLICY "Gestion temps réel des verrous" ON slot_locks FOR ALL USING (true);

-- ============================================================
-- 7. Données Initiales du Cabinet Pilote (Demo)
-- ============================================================
INSERT INTO cabinets (id, slug, name, specialty, address, phone)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'cabinet-el-chifa',
    'Cabinet Médical El Chifa',
    'Médecine Générale & Cardiologie',
    '12 Rue Didouche Mourad, Alger',
    '0550 12 34 56'
);

-- Horaires du Dimanche (0) au Jeudi (4) : 08:30 - 16:30 avec pause 12:00 - 13:00
INSERT INTO working_hours (cabinet_id, day_of_week, is_open, open_time, close_time, break_start, break_end, slot_duration_minutes)
VALUES
    ('00000000-0000-0000-0000-000000000001', 0, true, '08:30', '16:30', '12:00', '13:00', 30),
    ('00000000-0000-0000-0000-000000000001', 1, true, '08:30', '16:30', '12:00', '13:00', 30),
    ('00000000-0000-0000-0000-000000000001', 2, true, '08:30', '16:30', '12:00', '13:00', 30),
    ('00000000-0000-0000-0000-000000000001', 3, true, '08:30', '16:30', '12:00', '13:00', 30),
    ('00000000-0000-0000-0000-000000000001', 4, true, '08:30', '16:30', '12:00', '13:00', 30),
    ('00000000-0000-0000-0000-000000000001', 5, false, '08:30', '16:30', null, null, 30), -- Vendredi fermé
    ('00000000-0000-0000-0000-000000000001', 6, false, '08:30', '16:30', null, null, 30); -- Samedi fermé
