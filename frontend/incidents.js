class IncidentsPage {
    constructor() {
        this.checkStudentAuth();
        this.reports = [];
        this.filterType = "";
        this.filterStatus = "";
        this.viewMode = "all"; 
        this.currentUserId = localStorage.getItem('user_id'); // ID récupéré du Login
        this.init();
    }

    checkStudentAuth() {
        const role = localStorage.getItem('user_role');
        if (!role || role === 'admin') {
            window.location.href = 'login.html';
        }
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
        // Filtres Select
        document.getElementById("filterType").addEventListener("change", (e) => {
            this.filterType = e.target.value;
            this.render();
        });
        document.getElementById("filterStatus").addEventListener("change", (e) => {
            this.filterStatus = e.target.value;
            this.render();
        });
        
        // Onglets (Tous vs Mes Signalements)
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

        // 1. Filtrer par utilisateur si mode "mine"
        if (this.viewMode === "mine") {
            filtered = filtered.filter(r => r.user_id == this.currentUserId);
        }

        // 2. Filtres Type + Statut
        if (this.filterType) filtered = filtered.filter(r => r.title === this.filterType);
        if (this.filterStatus) filtered = filtered.filter(r => r.status === this.filterStatus);

        container.innerHTML = filtered.map(r => this.generateCard(r)).join('');
    }

    generateCard(report) {
        const statusColors = { nouveau: "#3b82f6", "en cours": "#f59e0b", resolu: "#22c55e" };
        const isMine = report.user_id == this.currentUserId;

        return `
            <div class="report-card" style="${isMine ? 'border-left: 4px solid #22c55e' : ''}">
                <div class="report-header">
                    <span class="report-type">${report.title}</span>
                    <span class="status-badge" style="background:${statusColors[report.status]}; color:white;">
                        ${report.status.toUpperCase()}
                    </span>
                </div>
                <div class="report-location">📍 ${report.location}</div>
                <div class="report-description">${report.description}</div>
                <div class="report-footer" style="margin-top:10px; font-size:12px; color:#888;">
                    ${isMine ? '<strong>Votre signalement</strong>' : 'Par: ' + (report.name || 'Étudiant')}
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => new IncidentsPage());