class GoogleAdsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
        this.setupBenefitsAnimation();
        this.setupWorkflowAnimation();
        this.setupResultsAnimation();
    }

    setupAnimations() {
        // Add entrance animations for content elements
        const title = document.querySelector('.google-ads__title');
        const subtitle = document.querySelector('.google-ads__subtitle');
        const cards = document.querySelector('.google-ads__cards');
        const floatingNote = document.querySelector('.google-ads__floating-note');
        const middleTitle = document.querySelector('.google-ads__middle-title');
        const bottomList = document.querySelector('.google-ads__bottom-list');
        const bottomImage = document.querySelector('.google-ads__bottom::before');

        // Animate title
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.animation = 'slideInUp 0.8s ease forwards';
            title.style.animationDelay = '0.2s';
        }

        // Animate subtitle
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(30px)';
            subtitle.style.animation = 'slideInUp 0.8s ease forwards';
            subtitle.style.animationDelay = '0.4s';
        }

        // Animate cards
        if (cards) {
            cards.style.opacity = '0';
            cards.style.transform = 'translateY(30px)';
            cards.style.animation = 'slideInUp 0.8s ease forwards';
            cards.style.animationDelay = '0.6s';
        }

        // Animate floating note
        if (floatingNote) {
            floatingNote.style.opacity = '0';
            floatingNote.style.transform = 'translateY(-50%) scale(0.8)';
            floatingNote.style.animation = 'slideInUp 0.8s ease forwards';
            floatingNote.style.animationDelay = '0.8s';
        }

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

        // Add hover effect for floating note
        const floatingNote = document.querySelector('.google-ads__floating-note');
        if (floatingNote) {
            floatingNote.addEventListener('mouseenter', () => {
                floatingNote.style.transform = 'translateY(-50%) scale(1.1)';
                floatingNote.style.transition = 'all 0.3s ease';
            });
            
            floatingNote.addEventListener('mouseleave', () => {
                floatingNote.style.transform = 'translateY(-50%) scale(1)';
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

    // Method to replay animations (useful for testing)
    replayAnimations() {
        const elements = document.querySelectorAll('.google-ads__title, .google-ads__subtitle, .google-ads__cards, .google-ads__floating-note, .google-ads__middle-title, .google-ads__bottom-list');
        
        elements.forEach((element, index) => {
            element.style.animation = 'none';
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.offsetHeight; // Force reflow
            element.style.animation = 'slideInUp 0.6s ease forwards';
            element.style.animationDelay = `${index * 0.1}s`;
        });

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

    // Method to test if animations are working
    testAnimations() {
        console.log('Testing Google Ads animations...');
        const title = document.querySelector('.google-ads__title');
        const cards = document.querySelector('.google-ads__cards');
        const listItems = document.querySelectorAll('.google-ads__list-item');
        const benefitItems = document.querySelectorAll('.google-ads__benefit-item');
        
        console.log('Title element:', title);
        console.log('Title opacity:', title ? title.style.opacity : 'not found');
        console.log('Title animation:', title ? title.style.animation : 'not found');
        
        console.log('Cards element:', cards);
        console.log('Cards opacity:', cards ? cards.style.opacity : 'not found');
        
        console.log('List items found:', listItems.length);
        listItems.forEach((item, index) => {
            console.log(`List item ${index} opacity:`, item.style.opacity);
            console.log(`List item ${index} animation:`, item.style.animation);
        });
        
        console.log('Benefit items found:', benefitItems.length);
        benefitItems.forEach((item, index) => {
            console.log(`Benefit item ${index} classes:`, item.className);
            console.log(`Benefit item ${index} transform:`, item.style.transform);
        });
        
        const workflowCards = document.querySelectorAll('.google-ads__workflow-card');
        console.log('Workflow cards found:', workflowCards.length);
        workflowCards.forEach((card, index) => {
            console.log(`Workflow card ${index} classes:`, card.className);
            console.log(`Workflow card ${index} width:`, card.style.width);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const googleAdsPage = new GoogleAdsPage();
    
    // Test animations after a short delay
    setTimeout(() => {
        googleAdsPage.testAnimations();
    }, 100);
});
