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
        this.translations = {
            cz: window.czTranslations || {},
            en: window.enTranslations || {}
        };
    }

    loadSavedLanguage() {
        const savedLanguage = localStorage.getItem('wov-language');
        const browserLanguage = navigator.language.split('-')[0];
        
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else if (this.translations[browserLanguage]) {
            this.currentLanguage = browserLanguage;
        } else {
            this.currentLanguage = 'cz';
        }
        
        this.setBodyLanguageClass();
    }

    bindEvents() {

    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('wov-language', language);
            this.setBodyLanguageClass();
            this.translatePage();
            this.updateMetaTags();
            this.emitLanguageChangeEvent();
            this.notifyComponentsOfLanguageChange();
        }
    }

    setLanguageSilent(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('wov-language', language);
            this.setBodyLanguageClass();
            this.translatePage();
            this.updateMetaTags();
            this.notifyComponentsOfLanguageChange();
        }
    }

    translatePage() {
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
        const title = this.getTranslation('meta.title');
        if (title) {
            document.title = title;
        }

        const description = this.getTranslation('meta.description');
        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            }
        }

        const keywords = this.getTranslation('meta.keywords');
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            }
        }

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

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    hasTranslation(key) {
        return !!this.translations[this.currentLanguage][key];
    }

    addTranslation(language, key, value) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        this.translations[language][key] = value;
    }

    getAllTranslations() {
        return this.translations[this.currentLanguage];
    }

    translate(key, fallback = null) {
        const translation = this.getTranslation(key);
        return translation !== key ? translation : (fallback || key);
    }

    translateWithVariables(key, variables = {}) {
        let translation = this.getTranslation(key);
        
        Object.keys(variables).forEach(variable => {
            translation = translation.replace(`{${variable}}`, variables[variable]);
        });
        
        return translation;
    }

    initializeTranslations() {
        this.translatePage();
        this.updateMetaTags();
        this.notifyComponentsOfLanguageChange();
    }

    setBodyLanguageClass() {
        document.body.classList.remove('lang-cz', 'lang-en');
        document.body.classList.add(`lang-${this.currentLanguage}`);
    }

    notifyComponentsOfLanguageChange() {
        const event = new CustomEvent('languageDisplayUpdate', {
            detail: { 
                language: this.currentLanguage
            }
        });
        document.dispatchEvent(event);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
} else {
    window.LanguageManager = LanguageManager;
}
