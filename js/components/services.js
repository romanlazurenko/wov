// Services Component Logic
class Services {
    constructor() {
        this.services = null;
        this.serviceCards = [];
        this.init();
    }

    init() {
        this.services = document.querySelector('.services');
        if (this.services) {
            this.serviceCards = Array.from(this.services.querySelectorAll('.services__card'));
            this.bindEvents();
        }
    }

    bindEvents() {
        // Service card interactions
        this.serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceId = card.dataset.service;
                this.handleServiceClick(serviceId, card);
            });

            // Mouse tracking for gradient effect
            card.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, card);
            });

            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.handleCardHover(card, false);
                // Don't reset gradient position - let it stay where it was
            });
        });

        // Service cards now only have titles, no separate buttons
    }

    handleServiceClick(serviceId, card) {
        // Add visual feedback
        this.animateCardClick(card);

        // Emit custom event for other components to listen
        this.emitEvent('serviceSelected', { 
            serviceId, 
            service: this.getServiceData(serviceId) 
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Calculate angle from center to mouse position
        const angle = Math.atan2(y, x) * (100 / Math.PI);
        const normalizedAngle = (angle + 20 + 60) % 360; // Normalize to 0-360
        
        card.style.setProperty('--gradient-angle', `${normalizedAngle}deg`);
    }

    resetGradient(card) {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    }

    handleCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = 'translateY(0)';
        }
    }

    animateCardClick(card) {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }, 150);
    }

    showServiceDetails(serviceId) {
        const service = this.getServiceData(serviceId);
        if (service) {
            this.createServiceModal(service);
        }
    }

    createServiceModal(service) {
        // Create modal for service details
        const modal = document.createElement('div');
        modal.className = 'services__modal';
        modal.innerHTML = `
            <div class="services__modal-content">
                <span class="services__modal-close">&times;</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <button class="cta-button">Získat konzultaci</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.services__modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // CTA button in modal
        const ctaButton = modal.querySelector('.cta-button');
        ctaButton.addEventListener('click', () => {
            this.emitEvent('ctaClicked', { source: 'services-modal', service: service.title });
            this.closeModal(modal);
        });

        // Emit custom event
        this.emitEvent('serviceModalOpened', { service });
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
        }
    }

    getServiceData(serviceId) {
        // Get service data from the card
        const card = this.services.querySelector(`[data-service="${serviceId}"]`);
        if (card) {
            const title = card.querySelector('.services__card-title').textContent;
            return { id: serviceId, title };
        }
        return null;
    }

    // Method to filter services
    filterServices(searchTerm) {
        this.serviceCards.forEach(card => {
            const title = card.querySelector('.services__card-title').textContent.toLowerCase();
            const matches = title.includes(searchTerm.toLowerCase());
            
            card.style.display = matches ? 'block' : 'none';
        });

        // Emit custom event
        this.emitEvent('servicesFiltered', { searchTerm });
    }

    // Method to clear filter
    clearFilter() {
        this.serviceCards.forEach(card => {
            card.style.display = 'block';
        });

        // Emit custom event
        this.emitEvent('servicesFilterCleared');
    }

    // Method to highlight service
    highlightService(serviceId) {
        this.serviceCards.forEach(card => {
            if (card.dataset.service === serviceId) {
                card.style.border = '2px solid var(--primary-green)';
                card.style.boxShadow = '0 0 20px rgba(96, 255, 160, 0.3)';
            } else {
                card.style.border = 'none';
                card.style.boxShadow = 'none';
            }
        });
    }

    // Method to remove highlight
    removeHighlight() {
        this.serviceCards.forEach(card => {
            card.style.border = 'none';
            card.style.boxShadow = 'none';
        });
    }

    // Method to get all service IDs
    getServiceIds() {
        return this.serviceCards.map(card => card.dataset.service);
    }

    // Method to get service by ID
    getServiceById(serviceId) {
        return this.serviceCards.find(card => card.dataset.service === serviceId);
    }

    // Method to animate services on scroll
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        });

        this.serviceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Method to emit custom events
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Services;
} else {
    window.Services = Services;
}
