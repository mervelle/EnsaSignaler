document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');
    const userId = localStorage.getItem('user_id');

    // Sécurité : si pas de rôle, on redirige
    if (!localStorage.getItem('user_role')) {
        window.location.href = 'login.html';
        return;
    }

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById('problemType').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            user_id: userId // Envoie l'ID 1 (Étudiant) par défaut
        };

        try {
            const response = await fetch("http://localhost:3000/signalements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Signalement envoyé !");
                window.location.href = 'incidents.html';
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    });
});