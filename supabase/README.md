# 📧 Templates d'Emails Supabase Auth — Tabibi | طبيبي

Ces modèles d'emails sont pré-conçus avec le design **Tabibi** (charte graphique émeraude, moderne, responsive et trilingue **Français / العربية / English** avec support RTL complet).

---

## 🛠️ Où les coller dans Supabase ?

1. Rendez-vous sur votre tableau de bord Supabase : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Choisissez votre projet **Tabibi** (`cnniaosssjirmwreeato`).
3. Dans le menu de gauche, cliquez sur **Authentication** puis sur **Email Templates**.
4. Pour chaque type d'email, remplacez le sujet (**Subject**) et le corps HTML (**Body**) par les fichiers correspondants ci-dessous.

---

## 📋 Correspondance des templates

### 1. Inscription / Vérification médecin (`Confirm signup`)
- **Fichier local** : `supabase/confirm_signup.html`
- **Sujet recommandé (Subject)** :
  ```text
  Confirmez votre compte Tabibi | تأكيد حسابك طبيبي
  ```
- **Description** : Envoyé automatiquement lorsqu'un médecin ou praticien s'inscrit sur la plateforme.

---

### 2. Mot de passe oublié (`Reset Password`)
- **Fichier local** : `supabase/reset_password.html`
- **Sujet recommandé (Subject)** :
  ```text
  Réinitialisation de votre mot de passe Tabibi | تغيير كلمة المرور
  ```
- **Description** : Envoyé lorsque l'utilisateur clique sur "Mot de passe oublié".

---

### 3. Connexion sans mot de passe (`Magic Link`)
- **Fichier local** : `supabase/magic_link.html`
- **Sujet recommandé (Subject)** :
  ```text
  Votre lien de connexion rapide Tabibi | رابط تسجيل الدخول
  ```
- **Description** : Permet à un praticien de se connecter d'un seul clic depuis son mobile ou PC.

---

### 4. Invitation collaborateur / secrétaire (`Invite user`)
- **Fichier local** : `supabase/invite_user.html`
- **Sujet recommandé (Subject)** :
  ```text
  Invitation à rejoindre Tabibi | دعوة للانضمام إلى طبيبي
  ```
- **Description** : Utilisé pour inviter une secrétaire médicale ou un confrère à rejoindre le cabinet.

---

### 5. Modification d'adresse email (`Change Email Address`)
- **Fichier local** : `supabase/change_email.html`
- **Sujet recommandé (Subject)** :
  ```text
  Confirmez votre nouvelle adresse email Tabibi | تأكيد البريد الإلكتروني
  ```
- **Description** : Envoyé pour valider un changement d'email professionnel.

---

## 💡 Notes importantes

- Les templates utilisent la variable Supabase standard `{{ .ConfirmationURL }}` pour générer automatiquement le lien sécurisé unique avec token.
- Aucune configuration SMTP externe ou achat de nom de domaine n'est nécessaire : le service d'envoi gratuit intégré de Supabase gère l'acheminement directement.
