# Architecture & Structure du Projet Tabibi v2.0

```text
tabibi/
├── package.json                    # Scripts (dev, build, check, start) & dépendances
├── tsconfig.json                   # Configuration TypeScript stricte (NodeNext, ES2022)
├── .gitignore                      # Protection stricte des sessions WhatsApp et variables d'env
├── STRUCTURE_GUIDELINES.md         # Charte universelle d'ingénierie logicielle
├── structure.md                    # Carte complète des fichiers et de leurs rôles
│
├── src/
│   ├── server.ts                   # Serveur Express TS + routage des 6 vues clientes (64 lignes)
│   │
│   ├── config/
│   │   ├── env.ts                  # Validation Zod des variables d'environnement (26 lignes)
│   │   └── rateLimit.ts            # Rate limiting hybride : 1/device + 2/IP sur 2h (41 lignes)
│   │
│   ├── types/
│   │   ├── cabinet.types.ts        # Contrat d'un cabinet et de ses horaires (26 lignes)
│   │   ├── booking.types.ts        # Contrat des rendez-vous et créneaux (42 lignes)
│   │   └── i18n.types.ts           # Schéma strict des traductions trilingues (115 lignes)
│   │
│   ├── utils/
│   │   └── date.ts                 # Calculs d'heures verrouillés sur Africa/Algiers (UTC+1) (42 lignes)
│   │
│   ├── i18n/
│   │   ├── fr.ts                   # Dictionnaire Français complet (115 lignes)
│   │   ├── ar.ts                   # Dictionnaire Arabe complet avec support RTL (115 lignes)
│   │   ├── en.ts                   # Dictionnaire Anglais complet (115 lignes)
│   │   └── index.ts                # Résolveur t() typé avec autocomplétion (45 lignes)
│   │
│   ├── database/
│   │   ├── schema.sql              # Les 4 tables PostgreSQL Supabase avec index (66 lignes)
│   │   └── supabase.ts             # Connecteur Supabase typé (23 lignes)
│   │
│   ├── services/
│   │   ├── slotEngine.ts           # Moteur de génération des créneaux & verrou 15 min (68 lignes)
│   │   ├── bookingService.ts       # Création de RDV, jetons sécurisés et annulations (100 lignes)
│   │   ├── openwaService.ts        # Moteur WhatsApp & formatage des messages trilingues (57 lignes)
│   │   └── reminderScheduler.ts    # Tâche automatique de rappels 24h & 2h (72 lignes)
│   │
│   ├── routes/
│   │   ├── booking.routes.ts       # API publique : profils, créneaux, verrous, réservations (104 lignes)
│   │   └── cabinet.routes.ts       # API privée cabinet : annulation de RDV en temps réel (16 lignes)
│   │
│   └── client/
│       ├── home/                   # Page d'accueil vitrine B2B (/)
│       │   ├── index.html          # Structure sémantique & data-i18n (71 lignes)
│       │   ├── home.ts             # Logique & commutation linguistique (34 lignes)
│       │   └── style.css           # Thème Confiance Clinique (191 lignes)
│       │
│       ├── auth/                   # Espace d'authentification praticien (/login, /signup, etc.)
│       │   ├── index.html          # Vues Connexion, Inscription, Reset, Vérif email (104 lignes)
│       │   ├── auth.ts             # Logique d'authentification Supabase (88 lignes)
│       │   └── style.css           # Thème formulaires médicaux (171 lignes)
│       │
│       ├── dashboard/              # Espace privé du cabinet (/dashboard)
│       │   ├── index.html          # Agenda du jour, Horaires, QR code (97 lignes)
│       │   ├── dashboard.ts        # Logique agenda, annulation temps réel, partage (105 lignes)
│       │   └── style.css           # Grille et tableaux d'affichage (204 lignes)
│       │
│       ├── booking/                # Page de réservation dédiée du cabinet (/:slug)
│       │   ├── index.html          # Calendrier, créneaux, formulaire WhatsApp (95 lignes)
│       │   ├── booking.ts          # Verrouillage 15 min, device ID, soumission (166 lignes)
│       │   └── style.css           # Thème patient Confiance Clinique (265 lignes)
│       │
│       ├── appointment/            # Page de suivi du lien WhatsApp (/r/:token)
│       │   ├── index.html          # Détails du RDV, consigne d'appel, état expiré (65 lignes)
│       │   ├── appointment.ts      # Vérification de validité et d'expiration (66 lignes)
│       │   └── style.css           # Fiche récapitulative médicale (117 lignes)
│       │
│       └── legal/                  # Pages institutionnelles & cadre légal (/about, /privacy, /terms, /cookies)
│           ├── index.html          # Lois algériennes 18-07, 18-11, 18-05, cookies techniques (75 lignes)
│           ├── legal.ts            # Commutation d'onglets et traductions (57 lignes)
│           └── style.css           # Thème documentaire légal (138 lignes)
```
