class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        // Add entrance animations for contact cards
        const cards = document.querySelectorAll('.contact__card');
        const phoneMockup = document.querySelector('.contact__phone-mockup');

        // Animate cards with staggered delays
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.animation = `slideInUp 0.6s ease forwards`;
            card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });

        // Animate phone mockup
        if (phoneMockup) {
            phoneMockup.style.opacity = '0';
            phoneMockup.style.transform = 'scale(0.8)';
            phoneMockup.style.animation = 'phoneAppear 0.8s ease forwards';
            phoneMockup.style.animationDelay = '0.4s';
        }
    }

    setupInteractions() {
        // Add click handlers for contact cards
        const cards = document.querySelectorAll('.contact__card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
        });

        // Add hover effects for phone mockup
        const phoneMockup = document.querySelector('.contact__phone-mockup');
        if (phoneMockup) {
            phoneMockup.addEventListener('mouseenter', () => {
                phoneMockup.style.transform = 'scale(1.05)';
            });
            
            phoneMockup.addEventListener('mouseleave', () => {
                phoneMockup.style.transform = 'scale(1)';
            });
        }
    }

    handleCardClick(card) {
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Handle different card types
        const iconImgs = card.querySelectorAll('.contact__icon-img');
        if (iconImgs.length > 0) {
            // Check the first icon to determine card type
            const firstIconSrc = iconImgs[0].src;
            
            if (firstIconSrc.includes('phone.svg')) {
                this.handlePhoneClick();
            } else if (firstIconSrc.includes('mail.svg')) {
                this.handleEmailClick();
            } else if (firstIconSrc.includes('telegram.svg') || firstIconSrc.includes('whatsapp.svg')) {
                this.handleMessageClick();
            }
        }
    }

    handlePhoneClick() {
        // Copy phone number to clipboard
        const phoneNumber = '+420 773 729 666';
        navigator.clipboard.writeText(phoneNumber).then(() => {
            this.showNotification('Telefonní číslo zkopírováno!');
        }).catch(() => {
            // Fallback for older browsers
            this.showNotification('Telefon: ' + phoneNumber);
        });
    }

    handleEmailClick() {
        // Copy email to clipboard
        const email = 'wayofvisionary@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            this.showNotification('Email zkopírován!');
        }).catch(() => {
            // Fallback for older browsers
            this.showNotification('Email: ' + email);
        });
    }

    handleMessageClick() {
        this.showNotification('Otevřít chat aplikaci...');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'contact__notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-green);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Method to replay animations (useful for testing)
    replayAnimations() {
        const cards = document.querySelectorAll('.contact__card');
        const phoneMockup = document.querySelector('.contact__phone-mockup');
        const profile = document.querySelector('.contact__profile');

        // Reset and replay card animations
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight; // Force reflow
            card.style.animation = `slideInUp 0.6s ease forwards`;
            card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });

        // Reset and replay phone animation
        if (phoneMockup) {
            phoneMockup.style.animation = 'none';
            phoneMockup.offsetHeight;
            phoneMockup.style.animation = 'phoneAppear 0.8s ease forwards';
            phoneMockup.style.animationDelay = '0.4s';
        }

        // Reset and replay profile animation
        if (profile) {
            profile.style.animation = 'none';
            profile.offsetHeight;
            profile.style.animation = 'profileAppear 0.5s ease forwards';
            profile.style.animationDelay = '0.8s';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});
