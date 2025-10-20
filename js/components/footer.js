
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
        const ctaButton = this.footer.querySelector('.footer__cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                this.handleCTAClick();
                this.animateButtonPress(ctaButton);
            });
        }

        const serviceLinks = this.footer.querySelectorAll('.footer__links a');
        serviceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleServiceLinkClick(link);
            });
        });

        const socialLinks = this.footer.querySelectorAll('.footer__social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(link);
            });
        });

        this.setupContactInteractions();
    }

    setupContactInteractions() {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');

        if (phoneElement) {
            phoneElement.style.cursor = 'pointer';
            phoneElement.addEventListener('click', () => {
                this.copyToClipboard(phoneElement.textContent);
                const message = window.languageManager ? 
                    window.languageManager.getTranslation('contact.copy.phone') : 'Telefon zkopírován';
                this.showCopyNotification(message);
            });
        }

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
        this.emitEvent('ctaClicked', { source: 'footer' });

        this.openContactForm();
    }

    animateButtonPress(button) {
        button.classList.add('button-pressed');
        
        setTimeout(() => {
            button.classList.remove('button-pressed');
        }, 150);
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

        this.emitEvent('serviceLinkClicked', { href, text: link.textContent });
    }

    handleSocialClick(link) {
        const platform = link.getAttribute('aria-label');
        const href = link.getAttribute('href');

        this.emitEvent('socialClicked', { platform, href });

        window.open(href, '_blank');
    }

    openContactForm() {
        const modal = document.createElement('div');
        modal.className = 'footer__contact-modal';
        modal.innerHTML = `
            <div class="footer__modal-content">
                <span class="footer__modal-close">&times;</span>
                <h3 class="footer__modal-title" data-translate="contact.form.title">Získat konzultaci</h3>
                <form class="footer__contact-form">
                    <input class="footer__contact-form-input" type="text" name="name" data-translate="contact.form.name" placeholder="Vaše jméno a příjmení" required>
                    <input class="footer__contact-form-input" type="email" name="email" data-translate="contact.form.email" placeholder="E-mail" required>
                    <input class="footer__contact-form-input" type="text" name="company" data-translate="contact.form.company" placeholder="Společnost">
                    <div class="footer__contact-form-select-wrapper">
                        <div class="footer__custom-select">
                            <div class="footer__custom-select-trigger">
                                <span class="footer__custom-select-value">O jakou službu máte zájem?</span>
                                <span class="footer__custom-select-arrow">▼</span>
                            </div>
                            <div class="footer__custom-select-options">
                                <div class="footer__custom-select-option" data-value="google-ads">Google Ads</div>
                                <div class="footer__custom-select-option" data-value="web-design">Webové stránky a design</div>
                                <div class="footer__custom-select-option" data-value="street-view">Street View</div>
                            </div>
                            <input type="hidden" name="service" class="footer__custom-select-input" required>
                        </div>
                    </div>
                    <textarea class="footer__contact-form-textarea" name="message" data-translate="contact.form.message" placeholder="Doplňující informace" rows="4"></textarea>
                    <div class="footer__contact-form-checkbox">
                        <input type="checkbox" id="consent" name="consent" required>
                        <label for="consent">Souhlasím se zpracováním mých osobních údajů v souladu se Zásadami ochrany osobních údajů.</label>
                    </div>
                    <button type="submit" class="footer__contact-form-submit" data-translate="contact.form.submit">Odeslat</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.footer__modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        this.setupCustomDropdown(modal);

        const form = modal.querySelector('.footer__contact-form');
        const submitButton = form.querySelector('.footer__contact-form-submit');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                this.animateButtonPress(submitButton);
            });
        }

        this.emitEvent('contactFormOpened');
    }

    setupCustomDropdown(modal) {
        const customSelect = modal.querySelector('.footer__custom-select');
        const trigger = customSelect.querySelector('.footer__custom-select-trigger');
        const options = customSelect.querySelector('.footer__custom-select-options');
        const optionItems = customSelect.querySelectorAll('.footer__custom-select-option');
        const valueSpan = customSelect.querySelector('.footer__custom-select-value');
        const hiddenInput = customSelect.querySelector('.footer__custom-select-input');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('footer__custom-select--open');
        });

        optionItems.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.textContent;
                
                valueSpan.textContent = text;
                hiddenInput.value = value;
                
                optionItems.forEach(opt => opt.classList.remove('footer__custom-select-option--selected'));
                option.classList.add('footer__custom-select-option--selected');
                
                customSelect.classList.remove('footer__custom-select--open');
            });

            option.addEventListener('mouseenter', () => {
                optionItems.forEach(opt => opt.classList.remove('footer__custom-select-option--hover'));
                option.classList.add('footer__custom-select-option--hover');
            });

            option.addEventListener('mouseleave', () => {
                option.classList.remove('footer__custom-select-option--hover');
            });
        });

        document.addEventListener('click', () => {
            customSelect.classList.remove('footer__custom-select--open');
        });
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            document.body.removeChild(modal);
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const successMessage = window.languageManager ? 
            window.languageManager.getTranslation('contact.form.success') : 'Zpráva odeslána!';
        this.showCopyNotification(successMessage);
        
        this.emitEvent('contactFormSubmitted', { data });
        
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

    updateContactInfo(phone, email) {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');

        if (phone && phoneElement) {
            phoneElement.textContent = phone;
        }

        if (email && emailElement) {
            emailElement.textContent = email;
        }

        this.emitEvent('contactInfoUpdated', { phone, email });
    }

    updateSocialLink(platform, newHref) {
        const socialLink = this.footer.querySelector(`[aria-label="${platform}"]`);
        if (socialLink) {
            socialLink.setAttribute('href', newHref);
            
            this.emitEvent('socialLinkUpdated', { platform, newHref });
        }
    }

    addSocialLink(platform, href, iconClass) {
        const socialIcons = this.footer.querySelector('.footer__social-icons');
        if (socialIcons) {
            const newLink = document.createElement('a');
            newLink.href = href;
            newLink.setAttribute('aria-label', platform);
            newLink.innerHTML = `<i class="${iconClass}"></i>`;
            
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(newLink);
            });
            
            socialIcons.appendChild(newLink);
            
            this.emitEvent('socialLinkAdded', { platform, href, iconClass });
        }
    }

    removeSocialLink(platform) {
        const socialLink = this.footer.querySelector(`[aria-label="${platform}"]`);
        if (socialLink) {
            socialLink.remove();
            
            this.emitEvent('socialLinkRemoved', { platform });
        }
    }

    updateCTAText(text) {
        const ctaButton = this.footer.querySelector('.footer__cta-button');
        if (ctaButton) {
            ctaButton.textContent = text;
        }
    }

    testButtonPress() {
        const ctaButton = this.footer.querySelector('.footer__cta-button');
        if (ctaButton) {
            this.animateButtonPress(ctaButton);
        }
    }

    getContactInfo() {
        const phoneElement = this.footer.querySelector('.footer__phone');
        const emailElement = this.footer.querySelector('.footer__email');
        
        return {
            phone: phoneElement ? phoneElement.textContent : null,
            email: emailElement ? emailElement.textContent : null
        };
    }

    getSocialLinks() {
        const socialLinks = this.footer.querySelectorAll('.footer__social-icons a');
        return Array.from(socialLinks).map(link => ({
            platform: link.getAttribute('aria-label'),
            href: link.getAttribute('href')
        }));
    }

    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
} else {
    window.Footer = Footer;
}
