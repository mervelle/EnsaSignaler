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
            .catch(err => console.error(err));
    }

    render() {
        const listContainer = document.getElementById("reportsList");
        
        // Structure en deux colonnes si ce n'est pas déjà fait dans le HTML
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
            tr.innerHTML = `<td>${r.name}</td><td>${r.title}</td>`;
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
                <p><strong>Utilisateur:</strong> ${report.name}</p>
                <p><strong>Type:</strong> ${report.title}</p>
                <p><strong>Lieu:</strong> ${report.location}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Statut Actuel:</strong> <span class="report-status status-${report.status.replace(' ', '-')}">${statusLabels[report.status]}</span></p>
                
                <div class="report-actions">
                    <button class="btn-orange" onclick="updateStatus(${report.id}, 'en cours')">En cours</button>
                    <button class="btn-green" onclick="updateStatus(${report.id}, 'resolu')">Résolu</button>
                </div>
            </div>
        `;
    }
}

window.updateStatus = function(id, status) {
    fetch(`http://localhost:3000/signalements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => {
        showGlobalNotification("Mis à jour avec succès !");
        new AdminPanel(); // Refresh
    });
}

function showGlobalNotification(msg) {
    const notify = document.getElementById("notification");
    document.getElementById("notificationMessage").innerText = msg;
    notify.classList.add("show");
    setTimeout(() => notify.classList.remove("show"), 3000);
}

new AdminPanel();