class AdminPanel {
    constructor() {
        this.reports = [];
        this.selectedReport = null;
        this.init();
    }

    init() {
        this.loadReports();
    }

    loadReports() {
        fetch("http://localhost:3000/signalements")
            .then(res => res.json())
            .then(data => {
                this.reports = data;
                this.render();
            })
            .catch(err => console.error("Erreur chargement:", err));
    }

    render() {
        const listContainer = document.getElementById("reportsList");
        if (!listContainer) return;

        // On injecte la structure Split-View si elle n'existe pas
        listContainer.innerHTML = `
            <div class="admin-dashboard">
                <div class="admin-sidebar">
                    <h4>Liste des incidents</h4>
                    <table class="admin-table">
                        <thead>
                            <tr><th>Utilisateur</th><th>Type</th></tr>
                        </thead>
                        <tbody id="tableBody"></tbody>
                    </table>
                </div>
                <div class="admin-details" id="detailsPane">
                    <div class="empty-state">Sélectionnez un incident pour voir les détails</div>
                </div>
            </div>
        `;

        const tbody = document.getElementById("tableBody");
        this.reports.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${r.name || 'Étudiant'}</td><td>${r.title}</td>`;
            tr.onclick = () => this.showDetails(r);
            tbody.appendChild(tr);
        });
    }

    showDetails(report) {
        this.selectedReport = report;
        const pane = document.getElementById("detailsPane");
        const statusLabels = { nouveau: "Ouvert", "en cours": "En cours", resolu: "Résolu" };
        
        pane.innerHTML = `
            <div class="report-card detail-view">
                <h3>Détails du Signalement #${report.id}</h3>
                <hr>
                <p><strong>Utilisateur:</strong> ${report.name || 'Étudiant'}</p>
                <p><strong>Type:</strong> ${report.title}</p>
                <p><strong>Lieu:</strong> ${report.location}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Statut Actuel:</strong> <span class="status-badge">${statusLabels[report.status]}</span></p>
                
                <div class="report-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn-orange" onclick="window.updateStatus(${report.id}, 'en cours')">Mettre En cours</button>
                    <button class="btn-green" onclick="window.updateStatus(${report.id}, 'resolu')">Marquer Résolu</button>
                </div>
            </div>
        `;
    }
}

// Fonction globale pour le bouton de changement de statut
window.updateStatus = function(id, status) {
    fetch(`http://localhost:3000/signalements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => {
        alert("Statut mis à jour ! ✅");
        location.reload(); // Recharge la page pour actualiser la liste
    })
    .catch(err => console.error("Erreur mise à jour:", err));
};

new AdminPanel();