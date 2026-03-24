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
                console.log("DATA:", data);
                this.reports = data;
                this.render();
            })
            .catch(err => console.error(err));
    }

    render() {
        const container = document.getElementById("reportsList");

        // 🔥 GROUP BY USER
        const grouped = {};

        this.reports.forEach(r => {
            if (!grouped[r.name]) {
                grouped[r.name] = [];
            }
            grouped[r.name].push(r);
        });

        container.innerHTML = Object.keys(grouped).map(user => `
            <div class="user-section">
                <h3 class="user-title">${user}</h3>

                ${grouped[user].map(r => this.createCard(r)).join('')}
            </div>
        `).join('');
    }

    createCard(report) {

        const statusLabels = {
            nouveau: "Ouvert",
            "en cours": "En cours",
            resolu: "Résolu"
        };

        const statusClasses = {
            nouveau: "status-open",
            "en cours": "status-progress",
            resolu: "status-resolved"
        };

        return `
        <div class="report-card">

            <div class="report-header">
                <span class="report-type">${report.title}</span>

                <span class="report-status ${statusClasses[report.status]}">
                    ${statusLabels[report.status]}
                </span>
            </div>

            <div class="report-user">${report.name}</div>

            <div class="report-location">${report.location}</div>

            <div class="report-description">${report.description}</div>

            <div class="report-actions">

                <button onclick="changeStatus(${report.id}, 'en cours')">
                    En cours
                </button>

                <button onclick="changeStatus(${report.id}, 'resolu')">
                    Résolu
                </button>

            </div>

        </div>
        `;
    }
}

new AdminPanel();


// ✅ MAKE FUNCTION GLOBAL (IMPORTANT FIX)
window.changeStatus = function(id, status) {
    fetch(`http://localhost:3000/signalements/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(data => {
        console.log("UPDATED:", data);

        // 🔥 Instead of reload → better UX
        const panel = new AdminPanel(); // reload data cleanly
    })
    .catch(err => console.error(err));
}