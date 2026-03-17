// EnsaSignaler Form Page JavaScript

class EnsaSignalerForm {
    constructor() {
        this.reports = this.loadReports();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadReportsDisplay();
    }

    bindEvents() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoPreview(e));
        }

        const closeBtn = document.getElementById('closeNotification');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideNotification());
        }

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.navigateBack());
        }
    }

    navigateBack() {
        window.location.href = 'index.html';
    }

    handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const report = {
        title: formData.get('problemType'),
        description: formData.get('description'),
        location: formData.get('location'),
        user_id: parseInt(formData.get('user'))
    };

    fetch("http://localhost:3000/signalements", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(report)
    })
    .then(response => response.json())
    .then(data => {
    console.log("Signalement enregistré:", data);
    this.showNotification('Signalement envoyé avec succès !');
    this.saveReport(report);
    })
    .catch(err => {
        console.error("Erreur:", err);
    });

    e.target.reset();
}

    handlePhotoPreview(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu de la photo">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    }

    saveReport(report) {
        this.reports.unshift(report);
        this.saveReportsToStorage();
        this.loadReportsDisplay();
    }

    loadReports() {
        const stored = localStorage.getItem('ensaSignalerReports');
        return stored ? JSON.parse(stored) : [];
    }

    saveReportsToStorage() {
        localStorage.setItem('ensaSignalerReports', JSON.stringify(this.reports));
    }

    loadReportsDisplay() {
        const container = document.getElementById('reportsList');
        if (!container) return;

        if (this.reports.length === 0) {
            container.innerHTML = '<p class="no-reports">Aucun signalement pour le moment.</p>';
            return;
        }

        container.innerHTML = this.reports.map(report => this.createReportCard(report)).join('');
    }

    createReportCard(report) {
        const statusLabels = {
            pending: 'En attente',
            'in-progress': 'En cours',
            resolved: 'Résolu'
        };

        const statusClasses = {
            pending: 'status-pending',
            'in-progress': 'status-in-progress',
            resolved: 'status-resolved'
        };

        const typeLabels = {
            déchets: 'Déchets sauvages',
            eau: 'Problème d\'eau',
            air: 'Pollution de l\'air',
            bruit: 'Bruit excessif',
            végétation: 'Problème de végétation',
            autre: 'Autre'
        };

        const formattedDate = new Date(report.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="report-card">
                <div class="report-header">
                    <span class="report-type">${typeLabels[report.type] || report.type}</span>
                    <span class="report-status ${statusClasses[report.status]}">${statusLabels[report.status]}</span>
                </div>
                <div class="report-location">${report.location}</div>
                <div class="report-description">${report.description}</div>
                ${report.photo ? `<div class="report-photo"><img src="${report.photo}" alt="Photo du problème" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;"></div>` : ''}
                <div class="report-date">Signalé le ${formattedDate}</div>
            </div>
        `;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');

        if (notification && messageEl) {
            messageEl.textContent = message;
            notification.classList.add('show');

            setTimeout(() => this.hideNotification(), 5000);
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }
}

// Initialize form page
document.addEventListener('DOMContentLoaded', () => {
    new EnsaSignalerForm();
});