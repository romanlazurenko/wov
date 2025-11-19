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
            // Initialize angle tracking for each card
            this.cardAngles = new Map();
            this.cardTargetAngles = new Map();
            this.animationFrames = new Map();
            this.cardMouseDistances = new Map(); // Store distance from center for each card
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
                // Stop animation and reset to default angle smoothly
                const frameId = this.animationFrames.get(card);
                if (frameId) {
                    cancelAnimationFrame(frameId);
                    this.animationFrames.delete(card);
                }
                this.cardTargetAngles.set(card, 135); // Default angle
                this.cardMouseDistances.delete(card); // Reset distance
                this.animateGradientAngle(card);
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
        // Throttle mousemove events for better performance
        if (!this.mouseMoveThrottle) {
            this.mouseMoveThrottle = new Map();
        }
        
        const lastTime = this.mouseMoveThrottle.get(card) || 0;
        const now = performance.now();
        
        // Throttle to ~60fps (16ms)
        if (now - lastTime < 16) {
            return;
        }
        
        this.mouseMoveThrottle.set(card, now);
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Calculate distance from center (normalized to 0-1, where 1 is at the corner)
        const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
        const distance = Math.sqrt(x * x + y * y);
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // Store distance for use in animation
        this.cardMouseDistances.set(card, normalizedDistance);
        
        // Calculate angle from center to mouse position (in degrees)
        const angleRad = Math.atan2(y, x);
        const angleDeg = angleRad * (180 / Math.PI); // Convert radians to degrees
        const normalizedAngle = ((angleDeg + 90) % 360 + 360) % 360; // Normalize to 0-360, offset by 90deg for better visual
        
        // Set target angle for smooth interpolation
        this.cardTargetAngles.set(card, normalizedAngle);
        
        // Start smooth animation if not already running
        if (!this.animationFrames.get(card)) {
            this.animateGradientAngle(card);
        }
    }

    animateGradientAngle(card) {
        const currentAngle = this.cardAngles.get(card) || 135; // Default angle
        const targetAngle = this.cardTargetAngles.get(card) || currentAngle;
        
        // Calculate shortest angular distance (handles wrap-around from 360° to 0°)
        let angleDiff = targetAngle - currentAngle;
        
        // Normalize to shortest path (-180° to 180°)
        if (angleDiff > 180) {
            angleDiff -= 360;
        } else if (angleDiff < -180) {
            angleDiff += 360;
        }
        
        // Dynamic interpolation factor based on distance from center
        // Closer to center (distance ~0) = smoother (lower lerp ~0.08)
        // Farther from center (distance ~1) = more responsive (higher lerp ~0.2)
        const normalizedDistance = this.cardMouseDistances.get(card) || 0.5;
        const minLerp = 0.08; // Very smooth when at center
        const maxLerp = 0.2;  // More responsive when at edges
        const lerpFactor = minLerp + (maxLerp - minLerp) * normalizedDistance;
        
        let newAngle = currentAngle + angleDiff * lerpFactor;
        
        // Normalize new angle to 0-360 range
        newAngle = ((newAngle % 360) + 360) % 360;
        
        // Check if we're close enough to stop animating (using shortest distance)
        const finalDiff = Math.abs(angleDiff);
        if (finalDiff < 0.1) {
            this.cardAngles.set(card, targetAngle);
            card.style.setProperty('--gradient-angle', `${targetAngle}deg`);
            this.animationFrames.delete(card);
            return;
        }
        
        // Update angle
        this.cardAngles.set(card, newAngle);
        card.style.setProperty('--gradient-angle', `${newAngle}deg`);
        
        // Continue animation
        const frameId = requestAnimationFrame(() => this.animateGradientAngle(card));
        this.animationFrames.set(card, frameId);
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
