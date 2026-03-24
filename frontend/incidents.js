class IncidentsPage {
    constructor() {
        this.reports = [];
        this.filterType = "";
        this.filterStatus = "";
        this.viewMode = "all"; // 'all' ou 'mine'
        this.currentUserId = 1; // À remplacer par localStorage.getItem('user_id')
        this.init();
    }

    init() {
        this.loadReports();
        this.bindEvents();
    }

    loadReports() {
        fetch("http://localhost:3000/signalements")
            .then(res => res.json())
            .then(data => {
                this.reports = data;
                this.render();
            });
    }

    bindEvents() {
        document.getElementById("filterType").addEventListener("change", (e) => {
            this.filterType = e.target.value;
            this.render();
        });
        document.getElementById("filterStatus").addEventListener("change", (e) => {
            this.filterStatus = e.target.value;
            this.render();
        });
        
        // Onglets Mes Signalements / Tous
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.viewMode = btn.dataset.view;
                this.render();
            });
        });
    }

    render() {
        const container = document.getElementById("reportsList");
        
        let filtered = this.reports;

        // 1. Filtre par vue (Mes signalements vs Tous)
        if (this.viewMode === "mine") {
            filtered = filtered.filter(r => r.user_id == this.currentUserId);
        }

        // 2. Filtre croisé Type + Statut
        if (this.filterType) {
            filtered = filtered.filter(r => r.title === this.filterType);
        }
        if (this.filterStatus) {
            filtered = filtered.filter(r => r.status === this.filterStatus);
        }

        container.innerHTML = filtered.map(r => this.generateCard(r)).join('');
    }

    generateCard(report) {
        const statusColors = { nouveau: "#3b82f6", "en cours": "#f59e0b", resolu: "#22c55e" };
        return `
            <div class="report-card">
                <div class="report-header">
                    <span class="report-type">${report.title}</span>
                    <span style="background:${statusColors[report.status]}; color:white; padding:4px 10px; border-radius:20px; font-size:12px;">
                        ${report.status.toUpperCase()}
                    </span>
                </div>
                <div class="report-location">📍 ${report.location}</div>
                <div class="report-description">${report.description}</div>
                <div class="report-user">Par: ${report.name}</div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => new IncidentsPage());