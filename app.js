// Main Application Module
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
        // Initialize language manager first
        this.components.languageManager = new LanguageManager();
        window.languageManager = this.components.languageManager;
        
        // Initialize all components (they will bind to existing HTML elements)
        this.components.header = new Header();
        this.components.hero = new Hero();
        this.components.services = new Services();
        this.components.statistics = new Statistics();
        this.components.footer = new Footer();
        
        // Initialize translations after components are loaded
        this.components.languageManager.initializeTranslations();
    }

    bindGlobalEvents() {
        // Listen for custom events from components
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

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    handleServiceSelected(detail) {
        console.log('Service selected:', detail);
        this.trackEvent('service_selected', detail.serviceId);
        
        // You can add additional logic here, like analytics tracking
        // or updating other components based on service selection
    }

    handleCTAClicked(detail) {
        console.log('CTA clicked from:', detail.source);
        this.trackEvent('cta_clicked', detail.source);
    }

    handleSocialClicked(detail) {
        console.log('Social link clicked:', detail.platform);
        this.trackEvent('social_clicked', detail.platform);
    }

    handleLanguageChanged(detail) {
        console.log('Language changed to:', detail.language);
        this.trackEvent('language_changed', detail.language);
        
        // Update header language display
        if (this.components.header) {
            this.components.header.updateLanguage(detail.language);
        }
        
        // Re-translate the page (but don't emit another event)
        if (this.components.languageManager) {
            this.components.languageManager.setLanguageSilent(detail.language);
        }
    }

    handleMobileMenuToggled(detail) {
        console.log('Mobile menu toggled:', detail.isOpen);
        this.trackEvent('mobile_menu_toggled', detail.isOpen);
    }

    handleKeyboardShortcuts(e) {
        // ESC key to close any open modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }

        // Ctrl/Cmd + K for search (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSearch();
        }

        // Arrow keys for navigation
        if (e.key === 'ArrowDown' && !e.ctrlKey && !e.metaKey) {
            this.navigateToNextSection();
        }
        
        if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey) {
            this.navigateToPreviousSection();
        }
    }

    handleWindowResize() {
        // Handle responsive changes
        this.updateMobileLayout();
        
        // Close mobile menu if open on desktop
        if (window.innerWidth > 768) {
            this.components.header.closeMobileMenu();
        }
    }

    setupIntersectionObserver() {
        // Global intersection observer for animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe elements that should animate
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => this.observer.observe(el));
    }

    updateMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        
        // Update components for mobile if needed
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
        // Future search functionality
        console.log('Search opened');
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
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'user_interaction',
                event_label: eventData
            });
        }
        
        // Console log for development
        console.log(`Event tracked: ${eventName}`, eventData);
    }

    // Method to get component by name
    getComponent(name) {
        return this.components[name];
    }

    // Method to update component data
    updateComponent(componentName, data) {
        const component = this.components[componentName];
        if (component && typeof component.updateData === 'function') {
            component.updateData(data);
        }
    }

    // Method to refresh all components
    refreshComponents() {
        Object.values(this.components).forEach(component => {
            if (typeof component.refresh === 'function') {
                component.refresh();
            }
        });
    }

    // Method to export app data
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

    // Method to import app data
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

    // Method to initialize animations
    initializeAnimations() {
        // Initialize hero animations
        if (this.components.hero) {
            this.components.hero.animateOnScroll();
        }

        // Initialize services animations
        if (this.components.services) {
            this.components.services.animateOnScroll();
        }

        // Statistics animations are handled automatically by the component
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Initialize animations after a short delay to ensure everything is loaded
    setTimeout(() => {
        window.app.initializeAnimations();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}