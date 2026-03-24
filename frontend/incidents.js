class IncidentsPage {
    constructor() {
        this.reports = [];
        this.currentFilter = "";

        this.init();
    }

    init() {
        this.loadReports();
        this.bindFilters();

        // 🔥 auto refresh every 5 sec
        setInterval(() => {
            this.loadReports();
        }, 5000);
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

    bindFilters() {
        const buttons = document.querySelectorAll(".filter-btn");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {

                // update active style
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // set filter
                this.currentFilter = btn.dataset.type;

                this.render();
            });
        });
    }

    render() {
        const container = document.getElementById("reportsList");

        let filtered = this.reports;

        if (this.currentFilter) {
            filtered = this.reports.filter(r => r.title === this.currentFilter);
        }

        container.innerHTML = filtered.map(r => this.card(r)).join('');
    }

    card(report) {

        const statusColors = {
            nouveau: "blue",
            "en cours": "#f59e0b",
            resolu: "#22c55e"
        };

        const formattedDate = report.created_at
            ? report.created_at.substring(0,16).replace("T"," ")
            : "Date inconnue";

        return `
        <div class="report-card">

            <div class="report-header">
                <span class="report-type">${report.title}</span>

                <span style="
                    background:${statusColors[report.status]};
                    color:white;
                    padding:4px 10px;
                    border-radius:20px;
                ">
                    ${report.status}
                </span>
            </div>

            <div class="report-location">${report.location}</div>
            <div class="report-description">${report.description}</div>

            <div class="report-date">${formattedDate}</div>

        </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new IncidentsPage();
});