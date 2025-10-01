// Language Manager Component
class LanguageManager {
    constructor() {
        this.currentLanguage = 'cz';
        this.translations = {};
        this.init();
    }

    init() {
        this.loadTranslations();
        this.loadSavedLanguage();
        this.bindEvents();
    }

    loadTranslations() {
        // Load translations from global variables
        this.translations = {
            cz: window.czTranslations || {},
            en: window.enTranslations || {}
        };
    }

    loadSavedLanguage() {
        // Load language from localStorage or detect from browser
        const savedLanguage = localStorage.getItem('wov-language');
        const browserLanguage = navigator.language.split('-')[0];
        
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else if (this.translations[browserLanguage]) {
            this.currentLanguage = browserLanguage;
        } else {
            this.currentLanguage = 'cz'; // Default to Czech
        }
    }

    bindEvents() {
        // No need to listen for languageChanged events here
        // This was causing the infinite loop
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('wov-language', language);
            this.translatePage();
            this.updateMetaTags();
            this.emitLanguageChangeEvent();
        }
    }

    setLanguageSilent(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('wov-language', language);
            this.translatePage();
            this.updateMetaTags();
            // Don't emit event to avoid infinite loop
        }
    }

    translatePage() {
        // Find all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    updateMetaTags() {
        // Update page title
        const title = this.getTranslation('meta.title');
        if (title) {
            document.title = title;
        }

        // Update meta description
        const description = this.getTranslation('meta.description');
        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            }
        }

        // Update meta keywords
        const keywords = this.getTranslation('meta.keywords');
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            }
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) {
            ogTitle.setAttribute('content', title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && description) {
            ogDescription.setAttribute('content', description);
        }
    }

    emitLanguageChangeEvent() {
        const event = new CustomEvent('languageChanged', {
            detail: { 
                language: this.currentLanguage,
                translations: this.translations[this.currentLanguage]
            }
        });
        document.dispatchEvent(event);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to get all available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Method to check if translation exists
    hasTranslation(key) {
        return !!this.translations[this.currentLanguage][key];
    }

    // Method to add custom translation
    addTranslation(language, key, value) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        this.translations[language][key] = value;
    }

    // Method to get all translations for current language
    getAllTranslations() {
        return this.translations[this.currentLanguage];
    }

    // Method to translate a specific text
    translate(key, fallback = null) {
        const translation = this.getTranslation(key);
        return translation !== key ? translation : (fallback || key);
    }

    // Method to format translations with variables
    translateWithVariables(key, variables = {}) {
        let translation = this.getTranslation(key);
        
        Object.keys(variables).forEach(variable => {
            translation = translation.replace(`{${variable}}`, variables[variable]);
        });
        
        return translation;
    }

    // Method to initialize translations on page load
    initializeTranslations() {
        this.translatePage();
        this.updateMetaTags();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
} else {
    window.LanguageManager = LanguageManager;
}
