class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        this.loadComponents();
        this.bindGlobalEvents();
        this.setupIntersectionObserver();
    }

    loadComponents() {
        this.components.languageManager = new LanguageManager();
        window.languageManager = this.components.languageManager;
        
        if (typeof Header !== 'undefined') {
            this.components.header = new Header();
        }
        
        if (typeof Hero !== 'undefined') {
            this.components.hero = new Hero();
        }
        
        if (typeof Services !== 'undefined') {
            this.components.services = new Services();
        }
        
        if (typeof Statistics !== 'undefined') {
            this.components.statistics = new Statistics();
        }
        
        if (typeof Footer !== 'undefined') {
            this.components.footer = new Footer();
        }
        
        // ProjectsSlider is initialized automatically in projects-slider.js with proper page detection
        // Don't initialize here to avoid double initialization
        if (typeof ProjectsSlider !== 'undefined' && window.projectsSlider) {
            this.components.projectsSlider = window.projectsSlider;
        }
        
        if (typeof StreetViewAnimations !== 'undefined') {
            this.components.streetViewAnimations = new StreetViewAnimations();
        }
        
        if (typeof ContactPage !== 'undefined') {
            this.components.contactPage = new ContactPage();
        }
        
        if (typeof WebDesignPage !== 'undefined') {
            this.components.webDesignPage = new WebDesignPage();
        }
        
        if (typeof GoogleAdsPage !== 'undefined') {
            this.components.googleAdsPage = new GoogleAdsPage();
        }
        
        this.components.languageManager.initializeTranslations();
    }

    bindGlobalEvents() {
        document.addEventListener('serviceSelected', (e) => {
            this.handleServiceSelected(e.detail);
        });

        document.addEventListener('ctaClicked', (e) => {
            this.handleCTAClicked(e.detail);
        });

        document.addEventListener('socialClicked', (e) => {
            this.handleSocialClicked(e.detail);
        });

        document.addEventListener('languageChanged', (e) => {
            this.handleLanguageChanged(e.detail);
        });

        document.addEventListener('mobileMenuToggled', (e) => {
            this.handleMobileMenuToggled(e.detail);
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    handleServiceSelected(detail) {
        this.trackEvent('service_selected', detail.serviceId);
        
    }

    handleCTAClicked(detail) {
        this.trackEvent('cta_clicked', detail.source);
    }

    handleSocialClicked(detail) {
        this.trackEvent('social_clicked', detail.platform);
    }

    handleLanguageChanged(detail) {
        this.trackEvent('language_changed', detail.language);
        
        if (this.components.header) {
            this.components.header.updateLanguage(detail.language);
        }
        
        if (this.components.languageManager) {
            this.components.languageManager.setLanguageSilent(detail.language);
        }
    }

    handleMobileMenuToggled(detail) {
        this.trackEvent('mobile_menu_toggled', detail.isOpen);
    }

    handleKeyboardShortcuts(e) {
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSearch();
        }

        if (e.key === 'ArrowDown' && !e.ctrlKey && !e.metaKey) {
            this.navigateToNextSection();
        }
        
        if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey) {
            this.navigateToPreviousSection();
        }
    }

    handleWindowResize() {
        this.updateMobileLayout();
        
        if (window.innerWidth > 768 && this.components.header && typeof this.components.header.closeMobileMenu === 'function') {
            this.components.header.closeMobileMenu();
        }
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => this.observer.observe(el));
    }

    updateMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile-layout');
        } else {
            document.body.classList.remove('mobile-layout');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('[class*="modal"]');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }

    openSearch() {
        this.trackEvent('search_opened');
    }

    navigateToNextSection() {
        const sections = ['#home', '#services', '.statistics', '#contact'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        if (currentIndex < sections.length - 1) {
            const nextSection = document.querySelector(sections[currentIndex + 1]);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    navigateToPreviousSection() {
        const sections = ['#home', '#services', '.statistics', '#contact'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        if (currentIndex > 0) {
            const prevSection = document.querySelector(sections[currentIndex - 1]);
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section, footer');
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section.id ? `#${section.id}` : `.${section.className.split(' ')[0]}`;
            }
        });
        
        return currentSection || '#home';
    }

    trackEvent(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'user_interaction',
                event_label: eventData
            });
        }
        
    }

    getComponent(name) {
        return this.components[name];
    }

    updateComponent(componentName, data) {
        const component = this.components[componentName];
        if (component && typeof component.updateData === 'function') {
            component.updateData(data);
        }
    }

    refreshComponents() {
        Object.values(this.components).forEach(component => {
            if (typeof component.refresh === 'function') {
                component.refresh();
            }
        });
    }

    exportData() {
        const data = {};
        Object.keys(this.components).forEach(key => {
            const component = this.components[key];
            if (typeof component.exportData === 'function') {
                data[key] = component.exportData();
            }
        });
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.keys(data).forEach(key => {
                const component = this.components[key];
                if (component && typeof component.importData === 'function') {
                    component.importData(data[key]);
                }
            });
            return true;
        } catch (error) {
            console.error('Invalid JSON data:', error);
            return false;
        }
    }

    initializeAnimations() {
        if (this.components.hero && typeof this.components.hero.animateOnScroll === 'function') {
            this.components.hero.animateOnScroll();
        }

        if (this.components.services && typeof this.components.services.animateOnScroll === 'function') {
            this.components.services.animateOnScroll();
        }

    }

    testGoogleAdsButtonPress() {
        if (this.components.googleAdsPage) {
            this.components.googleAdsPage.testButtonPress();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    setTimeout(() => {
        window.app.initializeAnimations();
    }, 100);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}