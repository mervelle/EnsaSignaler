document.addEventListener('DOMContentLoaded', () => {
    // Sélecteur utilisateur pour tester
    const testSelector = document.createElement('div');
    testSelector.innerHTML = `
    <div style="background: #333; color: white; padding: 10px; text-align: center;">
        Tester en tant que : 
        <select id="userSwitcher">
            <option value="1" ${localStorage.getItem('user_id') == '1' ? 'selected' : ''}>Marwa (ID 1)</option>
            <option value="2" ${localStorage.getItem('user_id') == '2' ? 'selected' : ''}>Rahma (ID 2)</option>
            <option value="3" ${localStorage.getItem('user_id') == '3' ? 'selected' : ''}>Salma (ID 3)</option>
            <option value="4" ${localStorage.getItem('user_id') == '4' ? 'selected' : ''}>Hafssa (ID 4)</option>
        </select>
    </div>
    `;
    document.body.prepend(testSelector);

    document.getElementById('userSwitcher').addEventListener('change', (e) => {
        localStorage.setItem('user_id', e.target.value);
        location.reload(); // Rafraîchit pour appliquer le changement
    });

    const reportForm = document.getElementById('reportForm');

    // Fonction pour générer une suggestion éco-responsable
    function generateEcoSuggestion(problemType) {
        switch(problemType) {
            case "déchets":
                return "Mettre en place des poubelles de tri à proximité.";
            case "eau":
                return "Vérifier et réparer les fuites pour économiser l'eau.";
            case "air":
                return "Planter plus d'arbres ou installer des purificateurs.";
            case "bruit":
                return "Installer des panneaux acoustiques ou limiter les heures bruyantes.";
            case "végétation":
                return "Entretenir les espaces verts régulièrement.";
            case "lumière":
                return "Installer des capteurs de mouvement pour éteindre les lumières inutiles.";
            default:
                return "Analyser et proposer une action éco-responsable adaptée.";
        }
    }

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('user_id');

        if (!userId) {
            alert("Erreur : Aucun utilisateur connecté.");
            return;
        }

        const formData = {
            title: document.getElementById('problemType').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            apogee: document.getElementById('apogee') ? document.getElementById('apogee').value : "",
            user_id: parseInt(userId)
        };

        try {
            // 1️⃣ Créer le signalement
            const response = await fetch("http://localhost:3000/signalements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // 2️⃣ Générer la suggestion automatiquement
                const suggestionText = generateEcoSuggestion(formData.title);

                // 3️⃣ Envoyer la suggestion au backend
                await fetch("http://localhost:3000/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        suggestion_text: suggestionText,
                        signalement_id: result.id // ID du signalement créé
                    })
                });

                alert("Signalement et suggestion envoyés !");
                window.location.href = 'incidents.html';
            } else {
                alert("Erreur : " + result.error);
            }

        } catch (error) {
            console.error(error);
            alert("Erreur de connexion au serveur.");
        }
    });
});