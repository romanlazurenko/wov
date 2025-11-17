class ContactPage {
    constructor() {
        this.currentNotification = null;
        this.notificationTimeout = null;
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
            // Prevent card click when clicking on icon links
            const iconLinks = card.querySelectorAll('.contact__icon a');
            iconLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click handler
                });
            });

            card.addEventListener('click', (e) => {
                // Don't handle card click if clicking on a link
                if (e.target.closest('a')) {
                    return;
                }
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
        const contactDetails = card.querySelector('.contact__details');
        
        // Handle address/ICO card
        if (contactDetails && contactDetails.querySelector('.contact__text--green')) {
            const addressText = contactDetails.querySelectorAll('.contact__text--green');
            let textToCopy = '';
            addressText.forEach((text, index) => {
                if (index > 0) textToCopy += '\n';
                textToCopy += text.textContent.trim();
            });
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const message = 'Address copied!';
                    this.showNotification(message);
                }).catch(() => {
                    this.showNotification('Address: ' + textToCopy);
                });
            }
            return;
        }
        
        if (iconImgs.length > 0) {
            const firstIconSrc = iconImgs[0].src;
            
            if (firstIconSrc.includes('phone.svg')) {
                this.handlePhoneClick();
            } else if (firstIconSrc.includes('mail.svg')) {
                this.handleEmailClick();
            }
        }
    }

    handlePhoneClick() {
        const phoneNumber = '+420 773 729 666';
        navigator.clipboard.writeText(phoneNumber).then(() => {
            const message = window.languageManager ? 
                window.languageManager.getTranslation('contact.notifications.phone.copied') : 
                'Telefonní číslo zkopírováno!';
            this.showNotification(message);
        }).catch(() => {
            const message = window.languageManager ? 
                window.languageManager.getTranslation('contact.notifications.phone.fallback') + ': ' + phoneNumber : 
                'Telefon: ' + phoneNumber;
            this.showNotification(message);
        });
    }

    handleEmailClick() {
        const email = 'info@wov.cz';
        navigator.clipboard.writeText(email).then(() => {
            const message = window.languageManager ? 
                window.languageManager.getTranslation('contact.notifications.email.copied') : 
                'Email zkopírován!';
            this.showNotification(message);
        }).catch(() => {
            const message = window.languageManager ? 
                window.languageManager.getTranslation('contact.notifications.email.fallback') + ': ' + email : 
                'Email: ' + email;
            this.showNotification(message);
        });
    }

    handleMessageClick() {
        // Get the chat application URL from the clicked element
        const iconImgs = document.querySelectorAll('.contact__icon-img');
        let chatUrl = '';
        
        iconImgs.forEach(img => {
            if (img.src.includes('telegram.svg')) {
                chatUrl = 'https://t.me/wayofvisionary';
            } else if (img.src.includes('whatsapp.svg')) {
                chatUrl = 'https://wa.me/420773729666';
            }
        });
        
        if (chatUrl) {
            navigator.clipboard.writeText(chatUrl).then(() => {
                const message = window.languageManager ? 
                    window.languageManager.getTranslation('contact.notifications.chat.copied') : 
                    'Chat adresa zkopírována!';
                this.showNotification(message);
            }).catch(() => {
                const message = window.languageManager ? 
                    window.languageManager.getTranslation('contact.notifications.chat.fallback') + ': ' + chatUrl : 
                    'Chat: ' + chatUrl;
                this.showNotification(message);
            });
        } else {
            const message = window.languageManager ? 
                window.languageManager.getTranslation('contact.notifications.message') : 
                'Otevřít chat aplikaci...';
            this.showNotification(message);
        }
    }

    showNotification(message) {
        // Immediately remove existing notification if any
        if (this.currentNotification) {
            this.removeNotificationImmediately();
        }
        
        const notification = document.createElement('div');
        notification.className = 'contact__notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-green);
            color: var(--dark-gray);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        this.currentNotification = notification;
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Clear any existing timeout and set new one
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        this.notificationTimeout = setTimeout(() => {
            this.removeNotification();
        }, 3000);
    }

    removeNotificationImmediately() {
        if (this.currentNotification) {
            // Clear any pending timeout
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
                this.notificationTimeout = null;
            }
            
            // Remove immediately without animation
            if (this.currentNotification.parentNode) {
                document.body.removeChild(this.currentNotification);
            }
            this.currentNotification = null;
        }
    }

    removeNotification() {
        if (this.currentNotification) {
            // Clear any pending timeout
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
                this.notificationTimeout = null;
            }
            
            this.currentNotification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (this.currentNotification && this.currentNotification.parentNode) {
                    document.body.removeChild(this.currentNotification);
                }
                this.currentNotification = null;
            }, 300);
        }
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
