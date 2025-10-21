class GoogleAdsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroAnimation();
        this.setupInteractions();
        this.setupBenefitsAnimation();
        this.setupWorkflowAnimation();
        this.setupResultsAnimation();
        this.setupMiddleAnimation();
    }

    setupHeroAnimation() {
        const heroBg = document.querySelector('.google-ads__hero-bg');
        const cards = document.querySelector('.google-ads__cards');
        const title = document.querySelector('.google-ads__title');
        const subtitle = document.querySelector('.google-ads__subtitle');

        if (!heroBg) return;

        // Check if mobile - skip animation on mobile devices
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, just show cards immediately and set dark colors
            if (cards) {
                cards.classList.add('visible');
            }
            if (title) {
                title.classList.add('dark');
            }
            if (subtitle) {
                subtitle.classList.add('dark');
            }
            return;
        }

        // Set initial state - background at full height
        heroBg.classList.add('initial');

        // Title and subtitle will animate via CSS automatically with light color

        // After delay, cut the background and reveal cards
        setTimeout(() => {
            // Cut the background
            heroBg.classList.remove('initial');
            heroBg.classList.add('cut');

            // Change title and subtitle color to dark
            if (title) {
                title.classList.add('dark');
            }
            if (subtitle) {
                subtitle.classList.add('dark');
            }

            // Show cards after a brief moment
            setTimeout(() => {
                if (cards) {
                    cards.classList.add('visible');
                }
            }, 400); // Cards appear 400ms after background starts cutting
        }, 1300); // Wait 2.2 seconds before cutting (allows title/subtitle to finish)
    }

    setupMiddleAnimation() {
        const middleTitle = document.querySelector('.google-ads__middle-title');
        const bottomList = document.querySelector('.google-ads__bottom-list');

        // Animate middle title
        if (middleTitle) {
            middleTitle.style.opacity = '0';
            middleTitle.style.transform = 'translateY(30px)';
            middleTitle.style.animation = 'slideInUp 0.8s ease forwards';
            middleTitle.style.animationDelay = '0.2s';
        }

        // Animate bottom list
        if (bottomList) {
            bottomList.style.opacity = '0';
            bottomList.style.transform = 'translateY(30px)';
            bottomList.style.animation = 'slideInUp 0.8s ease forwards';
            bottomList.style.animationDelay = '0.6s';
        }

        // Animate list items with staggered delays
        this.animateListItems();
    }

    animateListItems() {
        const listItems = document.querySelectorAll('.google-ads__list-item');
        
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.animation = 'slideInUp 0.6s ease forwards';
            item.style.animationDelay = `${0.8 + (index * 0.1)}s`;
        });
    }

    setupInteractions() {
        // Add click effects for list items
        const listItems = document.querySelectorAll('.google-ads__list-item');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                this.handleListItemClick(item);
            });
        });

        // Add hover effects for cards
        const cards = document.querySelectorAll('.google-ads__card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add hover effects for card ovals
        const cardOvals = document.querySelectorAll('.google-ads__card-oval');
        cardOvals.forEach(oval => {
            oval.addEventListener('mouseenter', () => {
                oval.style.transform = 'translateY(-5px)';
                oval.style.transition = 'all 0.3s ease';
            });
        });
        cardOvals.forEach(oval => {
            oval.addEventListener('mouseleave', () => {
                oval.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add hover effect for floating note
        const floatingNote = document.querySelector('.google-ads__floating-note');
        if (floatingNote) {
            floatingNote.addEventListener('mouseenter', () => {
                floatingNote.style.transition = 'all 0.3s ease';
            });
            
            floatingNote.addEventListener('mouseleave', () => {
                floatingNote.style.transform = 'scale(1)';
            });
        }

        // Add CTA button functionality
        const ctaButton = document.querySelector('.google-ads__cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                this.handleCTAClick();
                this.animateButtonPress(ctaButton);
            });
        }
    }

    handleListItemClick(item) {
        // Add click animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);

        // Add visual feedback
        const title = item.querySelector('.google-ads__list-title');
        if (title) {
            const originalColor = title.style.color;
            title.style.color = 'var(--primary-green)';
            setTimeout(() => {
                title.style.color = originalColor;
            }, 300);
        }
    }

    handleCTAClick() {
        // Emit custom event
        this.emitEvent('ctaClicked', { source: 'google-ads' });

        // Open contact form modal (same as header/footer)
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

    // Method to replay animations (useful for testing)
    replayAnimations() {
        const heroBg = document.querySelector('.google-ads__hero-bg');
        const cards = document.querySelector('.google-ads__cards');
        const title = document.querySelector('.google-ads__title');
        const subtitle = document.querySelector('.google-ads__subtitle');

        // Reset hero background
        if (heroBg) {
            heroBg.classList.remove('cut');
            heroBg.classList.add('initial');
        }

        // Reset cards
        if (cards) {
            cards.classList.remove('visible');
        }

        // Reset title and subtitle animations and colors
        if (title) {
            title.classList.remove('dark'); // Reset to light color
            title.style.animation = 'none';
            title.offsetHeight; // Force reflow
            title.style.animation = 'slideInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            title.style.animationDelay = '0.3s';
        }

        if (subtitle) {
            subtitle.classList.remove('dark'); // Reset to light color
            subtitle.style.animation = 'none';
            subtitle.offsetHeight; // Force reflow
            subtitle.style.animation = 'slideInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            subtitle.style.animationDelay = '0.6s';
        }

        // Replay the sequence
        setTimeout(() => {
            this.setupHeroAnimation();
        }, 100);

        // Replay list items
        this.animateListItems();
        
        // Replay benefits animation
        this.replayBenefitsAnimation();
        
        // Replay workflow animation
        this.replayWorkflowAnimation();
        
        // Replay results animation
        this.replayResultsAnimation();
    }
    
    // Method to replay benefits animation
    replayBenefitsAnimation() {
        const benefitItems = document.querySelectorAll('.google-ads__benefit-item');
        
        benefitItems.forEach(item => {
            item.classList.remove('animate');
            item.style.width = '0';
            item.style.opacity = '0';
        });
        
        // Re-trigger the animation
        setTimeout(() => {
            benefitItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            });
        }, 100);
    }
    
    // Method to replay workflow animation
    replayWorkflowAnimation() {
        const workflowCards = document.querySelectorAll('.google-ads__workflow-card');
        
        workflowCards.forEach(card => {
            card.classList.remove('animate');
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        });
        
        // Re-trigger the animation
        setTimeout(() => {
            workflowCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 150);
            });
        }, 100);
    }
    
    // Method to replay results animation
    replayResultsAnimation() {
        const leftPanel = document.querySelector('.google-ads__results-panel--left');
        const rightPanel = document.querySelector('.google-ads__results-panel--right');
        
        if (!leftPanel || !rightPanel) return;
        
        // Reset panels
        leftPanel.classList.remove('animate');
        rightPanel.classList.remove('animate');
        leftPanel.style.opacity = '0';
        leftPanel.style.transform = 'translateX(-100px)';
        rightPanel.style.opacity = '0';
        rightPanel.style.transform = 'translateX(100px)';
        
        // Re-trigger the animation
        setTimeout(() => {
            setTimeout(() => {
                leftPanel.classList.add('animate');
            }, 100);
            
            setTimeout(() => {
                rightPanel.classList.add('animate');
            }, 200);
        }, 100);
    }

    setupBenefitsAnimation() {
        const benefitsSection = document.querySelector('.google-ads__benefits');
        const benefitItems = document.querySelectorAll('.google-ads__benefit-item');
        
        if (!benefitsSection || benefitItems.length === 0) return;
        
        // Create intersection observer for benefits section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animate class to each benefit item with staggered delay
                    benefitItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 100); // 100ms delay between each item
                    });
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% of the section is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before section is fully visible
        });
        
        observer.observe(benefitsSection);
    }

    setupWorkflowAnimation() {
        const workflowSection = document.querySelector('.google-ads__workflow');
        const workflowCards = document.querySelectorAll('.google-ads__workflow-card');
        
        if (!workflowSection || workflowCards.length === 0) return;
        
        // Create intersection observer for workflow section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animate class to each workflow card with staggered delay
                    workflowCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150); // 150ms delay between each card
                    });
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of the section is visible
            rootMargin: '0px 0px -100px 0px' // Start animation earlier
        });
        
        observer.observe(workflowSection);
    }

    setupResultsAnimation() {
        const resultsSection = document.querySelector('.google-ads__results');
        const leftPanel = document.querySelector('.google-ads__results-panel--left');
        const rightPanel = document.querySelector('.google-ads__results-panel--right');
        
        if (!resultsSection || !leftPanel || !rightPanel) return;
        
        // Create intersection observer for results section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animate class to both panels with slight delay
                    setTimeout(() => {
                        leftPanel.classList.add('animate');
                    }, 100);
                    
                    setTimeout(() => {
                        rightPanel.classList.add('animate');
                    }, 200);
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% of the section is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before section is fully visible
        });
        
        observer.observe(resultsSection);
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

    testButtonPress() {
        const ctaButton = document.querySelector('.google-ads__cta-button');
        if (ctaButton) {
            this.animateButtonPress(ctaButton);
        }
    }

    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAdsPage;
} else {
    window.GoogleAdsPage = GoogleAdsPage;
}
