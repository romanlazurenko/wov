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

        // Mobile menu toggle
        const mobileMenuButton = this.header.querySelector('.header__mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Header scroll effects removed - header maintains consistent design

        // Language selector
        const languageSelector = this.header.querySelector('.header__language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('click', () => {
                this.handleLanguageClick();
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
        const navLinks = this.header.querySelector('.header__nav-links');
        
        if (navLinks) {
            navLinks.classList.toggle('header__nav-links--open');
        }

        // Update button icon
        const mobileMenuButton = this.header.querySelector('.header__mobile-menu-button i');
        if (mobileMenuButton) {
            mobileMenuButton.className = this.isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        }

        // Emit custom event
        this.emitEvent('mobileMenuToggled', { isOpen: this.isMobileMenuOpen });
    }

    // Scroll handling removed - header maintains consistent design

    handleLanguageClick() {
        // Toggle between CZ and EN
        const languageSpan = this.header.querySelector('#current-language');
        if (languageSpan) {
            const currentLang = languageSpan.textContent;
            const newLang = currentLang === 'CZ' ? 'EN' : 'CZ';
            languageSpan.textContent = newLang;
            
            // Emit custom event
            this.emitEvent('languageChanged', { language: newLang.toLowerCase() });
        }
    }

    // Method to update language programmatically
    updateLanguage(lang) {
        const languageSpan = this.header.querySelector('#current-language');
        if (languageSpan) {
            languageSpan.textContent = lang.toUpperCase();
        }
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
