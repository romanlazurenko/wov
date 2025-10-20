// Header Component Logic
class Header {
    constructor() {
        this.header = null;
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.header = document.querySelector('.header');
        if (this.header) {
            this.bindEvents();
            this.initializeLanguageDisplay();
        }
    }

    bindEvents() {
        // Smooth scrolling for navigation links
        const navLinks = this.header.querySelectorAll('a[href^="#"]');
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // CTA button functionality
        const ctaButton = this.header.querySelector('.header__cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                this.handleCTAClick();
                this.animateButtonPress(ctaButton);
            });
        }

        // Mobile burger menu toggle
        const burgerButton = this.header.querySelector('.header__burger');
        if (burgerButton) {
            burgerButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Mobile dropdown functionality
        this.setupMobileDropdowns();

        // Header scroll effects for glassmorphism
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Language selector dropdown
        const languageDropdown = this.header.querySelector('.header__language-dropdown');
        if (languageDropdown) {
            const languageLinks = languageDropdown.querySelectorAll('a[data-lang]');
            languageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = link.dataset.lang;
                    this.handleLanguageChange(lang);
                });
            });
        }

        // Listen for language display updates
        document.addEventListener('languageDisplayUpdate', (e) => {
            this.updateLanguageDisplay(e.detail.language);
        });
    }

    handleCTAClick() {
        // Emit custom event
        this.emitEvent('ctaClicked', { source: 'header' });

        // Open contact form modal (same as footer)
        this.openContactForm();
    }

    animateButtonPress(button) {
        // Add press effect class
        button.classList.add('button-pressed');
        
        // Remove the class after animation completes
        setTimeout(() => {
            button.classList.remove('button-pressed');
        }, 150);
    }

    openContactForm() {
        // Create contact form modal
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

        // Custom dropdown functionality
        this.setupCustomDropdown(modal);

        // Form submission
        const form = modal.querySelector('.footer__contact-form');
        const submitButton = form.querySelector('.footer__contact-form-submit');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Add press effect to submit button
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                this.animateButtonPress(submitButton);
            });
        }

        // Emit custom event
        this.emitEvent('contactFormOpened');
    }

    setupCustomDropdown(modal) {
        const customSelect = modal.querySelector('.footer__custom-select');
        const trigger = customSelect.querySelector('.footer__custom-select-trigger');
        const options = customSelect.querySelector('.footer__custom-select-options');
        const optionItems = customSelect.querySelectorAll('.footer__custom-select-option');
        const valueSpan = customSelect.querySelector('.footer__custom-select-value');
        const hiddenInput = customSelect.querySelector('.footer__custom-select-input');

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('footer__custom-select--open');
        });

        // Handle option selection
        optionItems.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.textContent;
                
                valueSpan.textContent = text;
                hiddenInput.value = value;
                
                // Remove selected class from all options
                optionItems.forEach(opt => opt.classList.remove('footer__custom-select-option--selected'));
                // Add selected class to clicked option
                option.classList.add('footer__custom-select-option--selected');
                
                // Close dropdown
                customSelect.classList.remove('footer__custom-select--open');
            });

            // Hover effect
            option.addEventListener('mouseenter', () => {
                optionItems.forEach(opt => opt.classList.remove('footer__custom-select-option--hover'));
                option.classList.add('footer__custom-select-option--hover');
            });

            option.addEventListener('mouseleave', () => {
                option.classList.remove('footer__custom-select-option--hover');
            });
        });

        // Close dropdown when clicking outside
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
        
        // Here you would typically send the data to your server
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

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const mobileNav = this.header.querySelector('.header__nav--mobile');
        const burgerButton = this.header.querySelector('.header__burger');
        
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }

        if (burgerButton) {
            burgerButton.classList.toggle('active');
        }

        // Prevent body scroll when menu is open
        if (this.isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }

        // Emit custom event
        this.emitEvent('mobileMenuToggled', { isOpen: this.isMobileMenuOpen });
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    handleLanguageChange(lang) {
        // Use the global language manager to change language
        if (window.languageManager) {
            window.languageManager.setLanguage(lang);
        }
        
        // Update current language display
        this.updateLanguageDisplay(lang);
    }

    // Method to update language programmatically
    updateLanguage(lang) {
        this.updateLanguageDisplay(lang);
    }

    // Method to update language display across all selectors
    updateLanguageDisplay(lang) {
        // Update desktop language selector
        const languageSpan = this.header.querySelector('#current-language');
        if (languageSpan) {
            languageSpan.textContent = lang.toUpperCase();
        }

        // Update mobile language selectors
        const mobileLanguageTriggers = this.header.querySelectorAll('.header__mobile-language-trigger[data-lang]');
        mobileLanguageTriggers.forEach(trigger => {
            if (trigger.getAttribute('data-lang') === lang) {
                trigger.classList.add('active');
            } else {
                trigger.classList.remove('active');
            }
        });
    }

    // Method to initialize language display on page load
    initializeLanguageDisplay() {
        // Wait for language manager to be available
        const checkLanguageManager = () => {
            if (window.languageManager) {
                const currentLang = window.languageManager.getCurrentLanguage();
                this.updateLanguageDisplay(currentLang);
            } else {
                // Retry after a short delay
                setTimeout(checkLanguageManager, 100);
            }
        };
        checkLanguageManager();
    }

    setupMobileDropdowns() {
        // Mobile language selectors
        const mobileLanguageTriggers = this.header.querySelectorAll('.header__mobile-language-trigger[data-lang]');
        mobileLanguageTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = trigger.getAttribute('data-lang');
                
                // Remove active class from all triggers
                mobileLanguageTriggers.forEach(t => t.classList.remove('active'));
                // Add active class to clicked trigger
                trigger.classList.add('active');
                
                this.handleLanguageChange(lang);
                
                // Close mobile menu
                this.closeMobileMenu();
            });
        });

        // Mobile CTA button
        const mobileCTAButton = this.header.querySelector('.header__mobile-cta-button');
        if (mobileCTAButton) {
            mobileCTAButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick();
                this.animateButtonPress(mobileCTAButton);
                this.closeMobileMenu();
            });
        }

        // Close mobile menu when clicking on navigation links
        const mobileNavLinks = this.header.querySelectorAll('.header__mobile-nav-links a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    // Method to close mobile menu
    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    // Method to get current language
    getCurrentLanguage() {
        const languageSpan = this.header.querySelector('.header__language-selector span');
        return languageSpan ? languageSpan.textContent : 'CZ';
    }

    // Method to emit custom events
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Method to add new navigation item
    addNavItem(href, text, position = 'end') {
        const navLinks = this.header.querySelector('.header__nav-links');
        if (navLinks) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = href;
            a.textContent = text;
            li.appendChild(a);

            if (position === 'start') {
                navLinks.insertBefore(li, navLinks.firstChild);
            } else {
                navLinks.appendChild(li);
            }

            // Bind click event for smooth scrolling
            a.addEventListener('click', (e) => {
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }
    }

    // Method to remove navigation item
    removeNavItem(href) {
        const navLink = this.header.querySelector(`a[href="${href}"]`);
        if (navLink) {
            navLink.parentElement.remove();
        }
    }

    // Method to update CTA button text
    updateCTAText(text) {
        const ctaButton = this.header.querySelector('.header__cta-button');
        if (ctaButton) {
            ctaButton.textContent = text;
        }
    }

    // Method to test button press animation (useful for debugging)
    testButtonPress() {
        const ctaButton = this.header.querySelector('.header__cta-button');
        if (ctaButton) {
            this.animateButtonPress(ctaButton);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
} else {
    window.Header = Header;
}
