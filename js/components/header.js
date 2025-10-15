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
            ctaButton.addEventListener('click', () => {
                this.handleCTAClick();
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
    }

    handleCTAClick() {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // Emit custom event
        this.emitEvent('ctaClicked', { source: 'header' });
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
        // Update current language display
        const languageSpan = this.header.querySelector('#current-language');
        if (languageSpan) {
            languageSpan.textContent = lang.toUpperCase();
            this.emitEvent('languageChanged', { language: lang });
        }
    }

    // Method to update language programmatically
    updateLanguage(lang) {
        const languageSpan = this.header.querySelector('#current-language');
        if (languageSpan) {
            languageSpan.textContent = lang.toUpperCase();
        }
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
                
                this.switchLanguage(lang);
                
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
} else {
    window.Header = Header;
}
