# 🌱 EnsaSignaler

Plateforme web permettant de signaler des problèmes environnementaux au sein de l’ENSA Béni Mellal.

---

## 📸 Aperçu
<img width="1295" height="615" alt="screenshot (1)" src="https://github.com/user-attachments/assets/ee3bd240-c353-4bcb-9ea1-5c4235d1e308" />




## 🚀 Fonctionnalités

### ✅ Frontend
- Page d’accueil moderne
- page admin pour modifier les status des signalements
- Formulaire de signalement (page de l'etudiant)
- page de signalements pour que l'etudiant consulte tous ses signalements
- Authentification simuler avec LocalStorage

### ✅ Backend
- API REST avec Node.js (Express)
- Route POST `/signalements`
- Validation des données

### ✅ Base de données
- PostgreSQL avec Docker
- Tables :
  - `users`
  - `signalements`
  - `suggestions`

### ✅ Intégration
- Connexion Frontend → Backend → Database
- Données enregistrées avec succès en base

---

## 🛠️ Technologies utilisées

- HTML / CSS / JavaScript
- Node.js / Express
- PostgreSQL
- Docker
- Git / GitHub

---

## ⚙️ Installation & Lancement

### 1️⃣ Cloner le projet

```bash
git clone <repo-url>
cd EnsaSignaler

2️⃣ Configurer les variables d’environnement

Créer un fichier .env dans backend/ :

DB_USER=admin
DB_PASSWORD=yourpassword
DB_NAME=ensasignaler
DB_PORT=5433

3️⃣ Lancer la base de données (Docker)
cd backend
docker-compose up -d

4️⃣ Lancer le backend
node server.js

👉 API disponible sur :

http://localhost:3000

5️⃣ Lancer le frontend
Option recommandée (VS Code)
Installer Live Server
Clic droit sur form.html

→ Open with Live Server

👉 Ou avec Python :

cd frontend
python -m http.server 5500

http://localhost:5500/form.html

🧪 Test

Remplir le formulaire
Envoyer un signalement
Vérifier dans PostgreSQL :

SELECT * FROM signalements;

👥 Collaboration
1️⃣ Mettre à jour le projet :

git pull origin main

2️⃣ Créer une branche :

git checkout -b feature/nom-de-la-tache

3️⃣ Faire les modifications

4️⃣ Ajouter et commit :

git add .
git commit -m "Feat: description de la tâche"

5️⃣ Push :

git push origin feature/nom-de-la-tache

6️⃣ Créer une Pull Request (GitHub)

Aller sur GitHub
Cliquer sur Compare & pull request
Décrire la tâche réalisée

📌 Règles de collaboration

Toujours travailler sur une branche (jamais sur main)
Faire des commits clairs
Tester avant de push
Attendre review avant merge
