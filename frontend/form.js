class EnsaSignalerForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('reportForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const report = {
            title: formData.get('problemType'),
            description: formData.get('description'),
            location: formData.get('location'),
            user_id: formData.get('user')
        };

        fetch("http://localhost:3000/signalements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Signalement enregistré:", data);
            this.showNotification("Signalement envoyé !");
        })
        .catch(err => console.error(err));

        e.target.reset();
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');

        if (notification && messageEl) {
            messageEl.textContent = message;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EnsaSignalerForm();
});