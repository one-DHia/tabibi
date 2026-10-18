# 🏛️ Charte Universelle de Structure & Standards d'Ingénierie Logicielle

Ce document définit les règles architecturales, structurelles et organisationnelles obligatoires pour le développement de projets professionnels. Tout développeur contribuant à ce dépôt doit respecter scrupuleusement ces consignes.

---

## 1. Principes Fondamentaux

1. **Responsabilité Unique (SRP - Single Responsibility Principle) :**
   * Un fichier = **Une seule mission claire**.
   * Une fonction = **Une seule action**.
   * Si un fichier commence à orchestrer trop d'opérations différentes, il doit être découpé immédiatement.

2. **Éviter de réinventer la roue :**
   * Exploiter les bibliothèques et frameworks éprouvés et maintenus pour éliminer le code verbeux (*boilerplate*), réduire la taille des fichiers et minimiser les risques de failles.

3. **Clarté sur l'astuce :**
   * Privilégier un code simple, lisible et explicite plutôt qu'un code condensé mais incompréhensible pour le reste de l'équipe.

---

## 2. Règle Stricte de Taille des Fichiers

Pour garantir la lisibilité, l'auditabilité et éviter les conflits de fusion (*merge conflicts*) sous Git :

* 🟢 **Zone idéale :** Entre **80 et 150 lignes** par fichier.
* 🟡 **Plafond maximal toléré :** **180 lignes**.
* 🔴 **Zone interdite (> 200 lignes) :** Tout fichier dépassant 200 lignes est rejeté en revue de code (*Code Review*).
  * **Solution :** Extraire la logique de calcul dans `utils/`, les types dans `types/`, ou subdiviser le service en sous-modules.

---

## 3. Règle d'Or Absolue : ZÉRO Texte en Dur (*Zero Hardcoding*)

* **Interdiction formelle :** Aucun texte destiné à un utilisateur (titre, paragraphe, bouton, placeholder, message d'erreur, alerte, notification) ne doit être écrit directement dans un fichier de code source.
* **Typage strict des langues (TypeScript First) :**
  * Proscrire les fichiers `.json` bruts pour la localisation (trop fragiles, sans autocomplétion, sans sécurité de compilation).
  * Utiliser des dictionnaires TypeScript typés (`.ts` avec `as const`).
* **Sécurité de compilation :**
  * L'absence d'une clé de traduction dans l'une des langues supportées doit bloquer la compilation TypeScript.
  * Les fautes de frappe sur les clés doivent être signalées en rouge dès la saisie dans l'IDE.

---

## 4. Architecture Universelle en Couches (Layered Architecture)

Le projet s'organise selon une séparation stricte des responsabilités :

```text
src/
├── config/           # Paramètres système, variables d'environnement validées, limites
├── types/            # Contrats de données purs (interfaces et types stricts uniquement)
├── database/         # Schémas, migrations et connecteurs d'accès aux données
├── services/         # Logique métier pure (indépendante du protocole web)
├── routes/           # Points d'entrée réseau (HTTP / API), aiguillage vers les services
├── utils/            # Petites fonctions pures et réutilisables (dates, formatage)
├── i18n/             # Dictionnaires typés par langue et moteur de résolution t()
└── client/ (ou ui/)  # Vues et composants d'interface utilisateur
```

### Règles de dépendance entre dossiers :
* `types/` ne dépend de rien (pure définition).
* `services/` dépend de `types/` et `database/`, mais ne sait rien de `routes/` ou de `client/`.
* `routes/` ne fait aucun calcul métier : elle valide l'entrée, appelle un `service`, et renvoie la réponse.

---

## 5. Gestion des Données et Cohérence Temporelle

1. **Prévention des conflits de concurrence :**
   * Tout système gérant des ressources partagées (créneaux, stocks, réservations) doit implémenter un verrouillage temporaire en base de données pour empêcher la réservation concurrente.
2. **Stateless & Résilience :**
   * Ne jamais compter sur des minuteurs en mémoire vive (`setTimeout` / `sleep`) pour des tâches critiques futures.
   * Toujours persister les échéances en base de données avec une routine d'exécution périodique pour survivre aux redémarrages serveur.
3. **Immuabilité des Fuseaux Horaires :**
   * Toutes les dates stockées le sont en UTC ou dans un fuseau cible explicitement verrouillé et documenté, évitant tout décalage client/serveur.

---

## 6. Sécurité & Protection Périmétrique

1. **Rate Limiting Hybride :**
   * Protection au niveau réseau (adresse IP) pour stopper les attaques massives.
   * Protection au niveau de l'appareil (Device ID / Empreinte) pour préserver l'équité sur les réseaux partagés (Wi-Fi public, foyers).
2. **Liens Éphémères :**
   * Les liens envoyés par messagerie externe doivent être signés, horodatés et invalidés dès la consommation de l'action ou le dépassement de la date limite.

---

## 7. Discipline Git & Travail en Équipe

1. **Découplage pour éviter les conflits :**
   * Les fonctionnalités distinctes sont développées dans des fichiers distincts.
2. **Secrets & Sécurité :**
   * Aucun secret, mot de passe, token ou clé API n'est versionné sur Git.
   * Les sessions actives et fichiers temporaires doivent figurer dans `.gitignore`.
3. **Clarté des commits :**
   * Utiliser les conventions de commits explicites (`feat:`, `fix:`, `refactor:`, `docs:`).
