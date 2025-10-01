// Footer Component Logic
class Footer {
    constructor() {
        this.footer = null;
        this.init();
    }

    init() {
        this.footer = document.querySelector('.footer');
        if (this.footer) {
            this.bindEvents();
        }
    }

    bindEvents() {
        // CTA button functionality
        const ctaButton = this.footer.querySelector('.footer__cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.handleCTAClick();
            });
        }

        // Service links
        const serviceLinks = this.footer.querySelectorAll('.footer__links a');
        serviceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleServiceLinkClick(link);
            });
        });

        // Social media links
        const socialLinks = this.footer.querySelectorAll('.footer__social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(link);
            });
        });

        // Contact info interactions
        this.setupContactInteractions();
    }

    setupContactInteractions() {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');

        // Phone click to copy
        if (phoneElement) {
            phoneElement.style.cursor = 'pointer';
            phoneElement.addEventListener('click', () => {
                this.copyToClipboard(phoneElement.textContent);
                const message = window.languageManager ? 
                    window.languageManager.getTranslation('contact.copy.phone') : 'Telefon zkopírován';
                this.showCopyNotification(message);
            });
        }

        // Email click to copy
        if (emailElement) {
            emailElement.style.cursor = 'pointer';
            emailElement.addEventListener('click', () => {
                this.copyToClipboard(emailElement.textContent);
                const message = window.languageManager ? 
                    window.languageManager.getTranslation('contact.copy.email') : 'Email zkopírován';
                this.showCopyNotification(message);
            });
        }
    }

    handleCTAClick() {
        // Emit custom event for other components to listen
        this.emitEvent('ctaClicked', { source: 'footer' });

        // Open contact form modal
        this.openContactForm();
    }

    handleServiceLinkClick(link) {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Emit custom event
        this.emitEvent('serviceLinkClicked', { href, text: link.textContent });
    }

    handleSocialClick(link) {
        const platform = link.getAttribute('aria-label');
        const href = link.getAttribute('href');

        // Emit custom event
        this.emitEvent('socialClicked', { platform, href });

        // Open social media link in new tab
        window.open(href, '_blank');
    }

    openContactForm() {
        // Create contact form modal
        const modal = document.createElement('div');
        modal.className = 'footer__contact-modal';
        modal.innerHTML = `
            <div class="footer__modal-content">
                <span class="footer__modal-close">&times;</span>
                <h3 data-translate="contact.form.title">Získat konzultaci</h3>
                <form class="footer__contact-form">
                    <input type="text" name="name" data-translate="contact.form.name" placeholder="Jméno" required>
                    <input type="email" name="email" data-translate="contact.form.email" placeholder="Email" required>
                    <input type="tel" name="phone" data-translate="contact.form.phone" placeholder="Telefon">
                    <textarea name="message" data-translate="contact.form.message" placeholder="Zpráva" rows="4"></textarea>
                    <button type="submit" class="cta-button" data-translate="contact.form.submit">Odeslat</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.footer__modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Form submission
        const form = modal.querySelector('.footer__contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Emit custom event
        this.emitEvent('contactFormOpened');
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        const successMessage = window.languageManager ? 
            window.languageManager.getTranslation('contact.form.success') : 'Zpráva odeslána!';
        this.showCopyNotification(successMessage);
        
        // Emit custom event
        this.emitEvent('contactFormSubmitted', { data });
        
        // Close modal
        const modal = form.closest('.footer__contact-modal');
        this.closeModal(modal);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-green);
            color: var(--dark-gray);
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 3000;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // Method to update contact information
    updateContactInfo(phone, email) {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');

        if (phone && phoneElement) {
            phoneElement.textContent = phone;
        }

        if (email && emailElement) {
            emailElement.textContent = email;
        }

        // Emit custom event
        this.emitEvent('contactInfoUpdated', { phone, email });
    }

    // Method to update social media links
    updateSocialLink(platform, newHref) {
        const socialLink = this.footer.querySelector(`[aria-label="${platform}"]`);
        if (socialLink) {
            socialLink.setAttribute('href', newHref);
            
            // Emit custom event
            this.emitEvent('socialLinkUpdated', { platform, newHref });
        }
    }

    // Method to add new social media link
    addSocialLink(platform, href, iconClass) {
        const socialIcons = this.footer.querySelector('.footer__social-icons');
        if (socialIcons) {
            const newLink = document.createElement('a');
            newLink.href = href;
            newLink.setAttribute('aria-label', platform);
            newLink.innerHTML = `<i class="${iconClass}"></i>`;
            
            // Bind click event
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(newLink);
            });
            
            socialIcons.appendChild(newLink);
            
            // Emit custom event
            this.emitEvent('socialLinkAdded', { platform, href, iconClass });
        }
    }

    // Method to remove social media link
    removeSocialLink(platform) {
        const socialLink = this.footer.querySelector(`[aria-label="${platform}"]`);
        if (socialLink) {
            socialLink.remove();
            
            // Emit custom event
            this.emitEvent('socialLinkRemoved', { platform });
        }
    }

    // Method to update CTA button text
    updateCTAText(text) {
        const ctaButton = this.footer.querySelector('.footer__cta-button');
        if (ctaButton) {
            ctaButton.textContent = text;
        }
    }

    // Method to get contact information
    getContactInfo() {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');
        
        return {
            phone: phoneElement ? phoneElement.textContent : null,
            email: emailElement ? emailElement.textContent : null
        };
    }

    // Method to get all social media links
    getSocialLinks() {
        const socialLinks = this.footer.querySelectorAll('.footer__social-icons a');
        return Array.from(socialLinks).map(link => ({
            platform: link.getAttribute('aria-label'),
            href: link.getAttribute('href')
        }));
    }

    // Method to emit custom events
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
} else {
    window.Footer = Footer;
}
