class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        const cards = document.querySelectorAll('.contact__card');
        const phoneMockup = document.querySelector('.contact__phone-mockup');
        const contactMaps = document.querySelectorAll('.contact__map');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.animation = `slideInUp 0.6s ease forwards`;
            card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });

        if (phoneMockup) {
            phoneMockup.style.opacity = '0';
            phoneMockup.style.transform = 'scale(0.8)';
            phoneMockup.style.animation = 'phoneAppear 0.8s ease forwards';
            phoneMockup.style.animationDelay = '0.4s';
        }

        contactMaps.forEach((map, index) => {
            const mapDelay = 0.5;
            map.style.opacity = '0';
            map.style.transform = 'translateX(-100px)';
            map.style.animation = 'slideInFromLeft 0.8s ease forwards';
            map.style.animationDelay = `${mapDelay}s`;
        });
    }

    setupInteractions() {
        const cards = document.querySelectorAll('.contact__card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
        });

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
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        const iconImgs = card.querySelectorAll('.contact__icon-img');
        if (iconImgs.length > 0) {
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
        const phoneNumber = '+420 773 729 666';
        navigator.clipboard.writeText(phoneNumber).then(() => {
            this.showNotification('Telefonní číslo zkopírováno!');
        }).catch(() => {
            this.showNotification('Telefon: ' + phoneNumber);
        });
    }

    handleEmailClick() {
        const email = 'wayofvisionary@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            this.showNotification('Email zkopírován!');
        }).catch(() => {
            this.showNotification('Email: ' + email);
        });
    }

    handleMessageClick() {
        this.showNotification('Otevřít chat aplikaci...');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'contact__notification';
        notification.textContent = message;
        
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
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    replayAnimations() {
        const cards = document.querySelectorAll('.contact__card');
        const phoneMockup = document.querySelector('.contact__phone-mockup');
        const profile = document.querySelector('.contact__profile');
        const contactMaps = document.querySelectorAll('.contact__map');

        const cardAnimationDuration = 0.6;
        const cardDelay = 0.1;
        const totalCardsDuration = (cards.length * cardDelay) + cardAnimationDuration;

        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `slideInUp 0.6s ease forwards`;
            card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });

        if (phoneMockup) {
            phoneMockup.style.animation = 'none';
            phoneMockup.offsetHeight;
            phoneMockup.style.animation = 'phoneAppear 0.8s ease forwards';
            phoneMockup.style.animationDelay = '0.4s';
        }

        if (profile) {
            profile.style.animation = 'none';
            profile.offsetHeight;
            profile.style.animation = 'profileAppear 0.5s ease forwards';
            profile.style.animationDelay = '0.8s';
        }

        contactMaps.forEach((map, index) => {
            map.style.animation = 'none';
            map.offsetHeight;
            map.style.animation = 'slideInFromLeft 0.8s ease forwards';
            map.style.animationDelay = `${totalCardsDuration + 0.2 + (index * 0.1)}s`;
        });
    }

    triggerMapAnimation() {
        const contactMaps = document.querySelectorAll('.contact__map');
        contactMaps.forEach((map, index) => {
            map.style.animation = 'none';
            map.offsetHeight;
            map.style.animation = 'slideInFromLeft 0.6s ease forwards';
            map.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});
