document.addEventListener('DOMContentLoaded', () => {
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

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // CRUCIAL : On récupère l'ID au moment précis où on clique sur le bouton
        const userId = localStorage.getItem('user_id');
        const userRole = localStorage.getItem('user_role');

        if (!userId) {
            alert("Erreur : Aucun utilisateur connecté.");
            return;
        }

        const formData = {
            title: document.getElementById('problemType').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            apogee: document.getElementById('apogee').value,
            user_id: parseInt(userId) // Prendra 1, 2, 3... selon le localStorage actuel
        };

        try {
            const response = await fetch("http://localhost:3000/signalements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Signalement réussi !");
                window.location.href = 'incidents.html';
            } else {
                // Le message d'erreur du backend s'affichera ici
                alert("Erreur : " + result.error);
            }
        } catch (error) {
            alert("Erreur de connexion au serveur.");
        }
    });
});