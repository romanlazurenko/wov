
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

    getTranslation(key) {
        return window.languageManager ? window.languageManager.getTranslation(key) : key;
    }

    openContactForm() {
        const modal = document.createElement('div');
        modal.className = 'footer__contact-modal';
        modal.innerHTML = `
            <div class="footer__modal-content">
                <span class="footer__modal-close">&times;</span>
                <h3 class="footer__modal-title" data-translate="contact.form.title">${this.getTranslation('contact.form.title')}</h3>
                <form class="footer__contact-form">
                    <input class="footer__contact-form-input" type="text" name="name" data-translate="contact.form.name" data-translate-placeholder="contact.form.name.placeholder" placeholder="${this.getTranslation('contact.form.name.placeholder')}" required>
                    <input class="footer__contact-form-input" type="email" name="email" data-translate="contact.form.email" data-translate-placeholder="contact.form.email.placeholder" placeholder="${this.getTranslation('contact.form.email.placeholder')}" required>
                    <input class="footer__contact-form-input" type="text" name="company" data-translate="contact.form.company" data-translate-placeholder="contact.form.company.placeholder" placeholder="${this.getTranslation('contact.form.company.placeholder')}">
                    <div class="footer__contact-form-select-wrapper">
                        <div class="footer__custom-select">
                            <div class="footer__custom-select-trigger">
                                <span class="footer__custom-select-value" data-translate="contact.form.service.placeholder">${this.getTranslation('contact.form.service.placeholder')}</span>
                                <span class="footer__custom-select-arrow">▼</span>
                            </div>
                            <div class="footer__custom-select-options">
                                <div class="footer__custom-select-option" data-value="google-ads" data-translate="contact.form.service.google-ads">${this.getTranslation('contact.form.service.google-ads')}</div>
                                <div class="footer__custom-select-option" data-value="web-design" data-translate="contact.form.service.web-design">${this.getTranslation('contact.form.service.web-design')}</div>
                                <div class="footer__custom-select-option" data-value="street-view" data-translate="contact.form.service.street-view">${this.getTranslation('contact.form.service.street-view')}</div>
                            </div>
                            <input type="hidden" name="service" class="footer__custom-select-input">
                        </div>
                    </div>
                    <textarea class="footer__contact-form-textarea" name="message" data-translate="contact.form.message" data-translate-placeholder="contact.form.message.placeholder" placeholder="${this.getTranslation('contact.form.message.placeholder')}" rows="4"></textarea>
                    <div class="footer__contact-form-checkbox">
                        <input type="checkbox" id="consent-${Date.now()}" name="consent" required>
                        <label for="consent-${Date.now()}" data-translate="contact.form.consent">${this.getTranslation('contact.form.consent')}</label>
                    </div>
                    <button type="submit" class="footer__contact-form-submit" data-translate="contact.form.submit">${this.getTranslation('contact.form.submit')}</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Store modal reference for language updates
        this.currentModal = modal;

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
            // Check HTML5 validation first
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            this.handleFormSubmission(form);
        });

        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                this.animateButtonPress(submitButton);
            });
        }

        // Listen for language changes
        this.setupLanguageListener(modal);

        // Translate the form immediately
        if (window.languageManager) {
            window.languageManager.translatePage();
        }

        this.emitEvent('contactFormOpened');
    }

    setupLanguageListener(modal) {
        const languageChangeHandler = () => {
            if (window.languageManager) {
                window.languageManager.translatePage();
                // Update placeholders manually since translatePage doesn't handle data-translate-placeholder
                const inputs = modal.querySelectorAll('[data-translate-placeholder]');
                inputs.forEach(input => {
                    const key = input.getAttribute('data-translate-placeholder');
                    input.placeholder = window.languageManager.getTranslation(key);
                });
                // Update selected dropdown value if an option is selected
                const hiddenInput = modal.querySelector('.footer__custom-select-input');
                const valueSpan = modal.querySelector('.footer__custom-select-value');
                if (hiddenInput && hiddenInput.value && valueSpan) {
                    const selectedOption = modal.querySelector(`[data-value="${hiddenInput.value}"]`);
                    if (selectedOption) {
                        valueSpan.textContent = window.languageManager.getTranslation(selectedOption.getAttribute('data-translate'));
                    }
                }
            }
        };

        document.addEventListener('languageChanged', languageChangeHandler);
        // Store handler for cleanup
        modal.dataset.languageHandler = 'active';
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
        if (this.currentModal === modal) {
            this.currentModal = null;
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate required fields before sending (only name and email are required)
        if (!data.name || !data.email) {
            const errorMessage = window.languageManager ? 
                window.languageManager.getTranslation('contact.form.error') : 'Vyplňte prosím všechna povinná pole.';
            this.showCopyNotification(errorMessage);
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('.footer__contact-form-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = window.languageManager ? 
            window.languageManager.getTranslation('contact.form.submit.loading') : 'Odesílám...';
        
        try {
            // Send email via PHP script
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Check if response is ok
            if (!response.ok) {
                let errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                throw new Error(errorData.error || 'Failed to send email');
            }
            
            const result = await response.json();
            
            if (result.success) {
                const successMessage = window.languageManager ? 
                    window.languageManager.getTranslation('contact.form.success') : 'Zpráva odeslána!';
                this.showCopyNotification(successMessage);
                
                this.emitEvent('contactFormSubmitted', { data });
                
                const modal = form.closest('.footer__contact-modal');
                this.closeModal(modal);
            } else {
                throw new Error(result.error || 'Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            console.error('Form data sent:', data);
            const errorMessage = window.languageManager ? 
                window.languageManager.getTranslation('contact.form.error') : 'Chyba při odesílání. Zkuste to prosím znovu.';
            this.showCopyNotification(errorMessage);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
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
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-green);
            color: var(--dark-gray);
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 3000;
            font-weight: 600;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(notification);

        // Slide in animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Slide out and remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300); // Wait for animation to complete
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
