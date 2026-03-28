class IncidentsPage {
    constructor() {
        this.checkStudentAuth();
        this.reports = [];
        this.filterType = "";
        this.filterStatus = "";
        this.viewMode = "all"; 
        this.currentUserId = localStorage.getItem('user_id'); 
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

    // --- TA FONCTION LOCALE (Plus besoin de fetch ici) ---
    generateEcoSuggestion(problemType) {
        const type = problemType ? problemType.toLowerCase() : "";
        switch(type) {
            case "déchets": return "Mettre en place des poubelles de tri à proximité.";
            case "eau": return "Vérifier et réparer les fuites pour économiser l'eau.";
            case "air": return "Planter plus d'arbres ou installer des purificateurs.";
            case "bruit": return "Installer des panneaux acoustiques ou limiter les heures bruyantes.";
            case "végétation": return "Entretenir les espaces verts régulièrement.";
            case "lumière": return "Installer des capteurs de mouvement pour éteindre les lumières inutiles.";
            default: return "Analyser et proposer une action éco-responsable adaptée.";
        }
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

        if (this.viewMode === "mine") {
            filtered = filtered.filter(r => r.user_id == this.currentUserId);
        }

        if (this.filterType) filtered = filtered.filter(r => r.title === this.filterType);
        if (this.filterStatus) filtered = filtered.filter(r => r.status === this.filterStatus);

        container.innerHTML = "";

        if (filtered.length === 0) {
            container.innerHTML = "<p style='text-align:center;'>Aucun incident trouvé.</p>";
            return;
        }

        // Affichage immédiat car on ne fait plus de await fetchSuggestion
        filtered.forEach(report => {
            const suggestion = this.generateEcoSuggestion(report.title);
            container.innerHTML += this.generateCard(report, suggestion);
        });
    }

    generateCard(report, suggestionText) {
        const statusColors = { nouveau: "#3b82f6", "en cours": "#f59e0b", resolu: "#22c55e" };
        const isMine = report.user_id == this.currentUserId;

        return `
            <div class="report-card" style="${isMine ? 'border-left: 5px solid #22c55e' : ''}; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left;">
                <div class="report-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="report-type" style="font-weight:bold; text-transform:capitalize; color: #166534;">${report.title}</span>
                    <span class="status-badge" style="background:${statusColors[report.status] || '#888'}; color:white; padding: 4px 10px; border-radius: 6px; font-size:11px; font-weight:bold;">
                        ${report.status.toUpperCase()}
                    </span>
                </div>
                <div class="report-location" style="font-size:13px; color:#666; margin: 8px 0;">📍 ${report.location}</div>
                <div class="report-description" style="margin: 10px 0; font-size:14px; color: #444;">${report.description}</div>
                
                <div class="eco-suggestion" style="background: #f0fdf4; border: 1px dashed #22c55e; padding: 12px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin:0; font-size:13px; color:#166534; line-height: 1.4;">
                        🌱 <strong>Suggestion Éco :</strong> ${suggestionText}
                    </p>
                </div>

                <div class="report-footer" style="margin-top:10px; font-size:11px; color:#999; border-top: 1px solid #eee; padding-top: 10px; display: flex; justify-content: space-between;">
                    <span>${isMine ? '<strong>Votre signalement</strong>' : 'Par: ' + (report.name || 'Étudiant')}</span>
                    <span>${new Date(report.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => new IncidentsPage());