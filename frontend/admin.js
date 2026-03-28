class AdminPanel {
    constructor() {
        this.reports = [];
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
                this.render(); // Affiche la vue interactive
                this.renderStaticTable(); // Affiche le tableau statistique en dessous
            })
            .catch(err => console.error("Erreur chargement:", err));
    }

    // 1. Vue Interactive (Celle de ta photo)
    render() {
        const listContainer = document.getElementById("reportsList");
        if (!listContainer) return;

        listContainer.innerHTML = `
            <div class="admin-dashboard">
                <div class="admin-sidebar">
                    <h4>Flux des incidents</h4>
                    <table class="admin-table">
                        <thead>
                            <tr><th>État</th><th>Utilisateur</th><th>Type</th></tr>
                        </thead>
                        <tbody id="tableBody"></tbody>
                    </table>
                </div>
                <div class="admin-details" id="detailsPane">
                    <div class="empty-state">Sélectionnez un incident pour agir</div>
                </div>
            </div>
            
            <div id="statisticsSection" style="margin-top: 50px;"></div>
        `;

        const tbody = document.getElementById("tableBody");
        const statusColors = { nouveau: "#3b82f6", "en cours": "#f59e0b", resolu: "#22c55e" };

        this.reports.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span style="height:10px; width:10px; background:${statusColors[r.status]}; border-radius:50%; display:inline-block;"></span></td>
                <td>${r.name || 'Étudiant'}</td>
                <td>${r.title}</td>
            `;
            tr.onclick = () => this.showDetails(r);
            tbody.appendChild(tr);
        });
    }

    showDetails(report) {
        const pane = document.getElementById("detailsPane");
        pane.innerHTML = `
            <div class="report-card detail-view">
                <h3>Détails #${report.id}</h3>
                <p><strong>Utilisateur:</strong> ${report.name || 'Inconnu'}</p>
                <p><strong>Lieu:</strong> ${report.location}</p>
                <p><strong>Statut:</strong> <span class="report-status status-${report.status.replace(' ', '-')}">${report.status}</span></p>
                <div class="report-actions">
                    <button class="btn-orange" onclick="window.updateStatus(${report.id}, 'en cours')">⏳ En cours</button>
                    <button class="btn-green" onclick="window.updateStatus(${report.id}, 'resolu')">✅ Résolu</button>
                </div>
            </div>
        `;
    }

    // 2. LE TABLEAU STATISTIQUE (Ce qui manque pour ton projet)
    renderStaticTable() {
        const statsSection = document.getElementById("statisticsSection");
        if (!statsSection) return;

        statsSection.innerHTML = `
            <div class="report-card" style="width: 100%; overflow-x: auto;">
                <h3 style="text-align: left; color: #166534;">📊 Rapport Statistique Global</h3>
                <table class="admin-table static-view" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead>
                        <tr style="background: #f0fdf4; text-align: left;">
                            <th>ID</th>
                            <th>Date</th>
                            <th>Étudiant</th>
                            <th>Apogée</th>
                            <th>Type</th>
                            <th>Lieu</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody id="staticTableBody"></tbody>
                </table>
            </div>
        `;

        const staticBody = document.getElementById("staticTableBody");
        staticBody.innerHTML = this.reports.map(r => `
            <tr>
                <td>#${r.id}</td>
                <td>${new Date(r.created_at).toLocaleDateString()}</td>
                <td>${r.name || 'Inconnu'}</td>
                <td><code>${r.apogee || '-'}</code></td>
                <td>${r.title}</td>
                <td>${r.location}</td>
                <td><span class="report-status status-${r.status.replace(' ', '-')}">${r.status}</span></td>
            </tr>
        `).join('');
    }
}

// Global update
window.updateStatus = function(id, status) {
    fetch(`http://localhost:3000/signalements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    }).then(() => location.reload());
};

new AdminPanel();