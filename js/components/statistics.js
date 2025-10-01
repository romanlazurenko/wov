// Statistics Component Logic
class Statistics {
    constructor() {
        this.statistics = null;
        this.statItems = [];
        this.animationObserver = null;
        this.init();
    }

    init() {
        this.statistics = document.querySelector('.statistics');
        if (this.statistics) {
            this.statItems = Array.from(this.statistics.querySelectorAll('.statistics__item'));
            this.bindEvents();
            this.setupScrollAnimation();
        }
    }

    bindEvents() {
        // Add hover effects
        this.statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.handleItemHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.handleItemHover(item, false);
            });
        });
    }

    setupScrollAnimation() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStat(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statItems.forEach(item => {
            this.animationObserver.observe(item);
        });
    }

    handleItemHover(item, isHovering) {
        const circle = item.querySelector('.statistics__circle');
        if (isHovering) {
            circle.style.transform = 'scale(1.1)';
            circle.style.boxShadow = '0 0 30px rgba(96, 255, 160, 0.3)';
        } else {
            circle.style.transform = 'scale(1)';
            circle.style.boxShadow = 'none';
        }
    }

    animateStat(statItem) {
        const circle = statItem.querySelector('.statistics__circle');
        const value = statItem.querySelector('.statistics__value');
        const description = statItem.querySelector('.statistics__description');
        
        // Animate circle
        this.animateCircle(circle);

        // Animate value with counter effect
        this.animateCounter(value);

        // Animate description
        this.animateDescription(description);

        // Emit custom event
        this.emitEvent('statAnimated', { 
            statId: statItem.dataset.stat,
            value: value.textContent 
        });
    }

    animateCircle(circle) {
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0.5)';
        circle.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            circle.style.opacity = '1';
            circle.style.transform = 'scale(1)';
        }, 200);
    }

    animateCounter(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isMultiplier = text.includes('x');
        const isPlus = text.includes('+');
        
        let targetValue = 0;
        let suffix = '';
        
        if (isPercentage) {
            targetValue = parseInt(text);
            suffix = '%';
        } else if (isMultiplier) {
            targetValue = parseInt(text.replace('x', ''));
            suffix = 'x';
        } else if (isPlus) {
            targetValue = parseInt(text.replace('+', ''));
            suffix = '+';
        } else {
            // For other values, just fade in
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.6s ease';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 200);
            return;
        }

        this.runCounter(element, targetValue, suffix);
    }

    runCounter(element, targetValue, suffix) {
        let currentValue = 0;
        const increment = targetValue / 50; // 50 steps
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue) + suffix;
        }, 20);
    }

    animateDescription(description) {
        description.style.opacity = '0';
        description.style.transform = 'translateY(20px)';
        description.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
        }, 400);
    }

    // Method to update statistics data
    updateStatValue(statId, newValue) {
        const statItem = this.statistics.querySelector(`[data-stat="${statId}"]`);
        if (statItem) {
            const valueElement = statItem.querySelector('.statistics__value');
            if (valueElement) {
                valueElement.textContent = newValue;
                
                // Emit custom event
                this.emitEvent('statValueUpdated', { statId, newValue });
            }
        }
    }

    // Method to update stat description
    updateStatDescription(statId, newDescription) {
        const statItem = this.statistics.querySelector(`[data-stat="${statId}"]`);
        if (statItem) {
            const descriptionElement = statItem.querySelector('.statistics__description');
            if (descriptionElement) {
                descriptionElement.textContent = newDescription;
                
                // Emit custom event
                this.emitEvent('statDescriptionUpdated', { statId, newDescription });
            }
        }
    }

    // Method to refresh animations
    refreshAnimations() {
        this.statItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
        });

        setTimeout(() => {
            this.setupScrollAnimation();
        }, 100);
    }

    // Method to get all stat IDs
    getStatIds() {
        return this.statItems.map(item => item.dataset.stat);
    }

    // Method to get stat by ID
    getStatById(statId) {
        return this.statItems.find(item => item.dataset.stat === statId);
    }

    // Method to get stat value
    getStatValue(statId) {
        const statItem = this.getStatById(statId);
        if (statItem) {
            const valueElement = statItem.querySelector('.statistics__value');
            return valueElement ? valueElement.textContent : null;
        }
        return null;
    }

    // Method to get stat description
    getStatDescription(statId) {
        const statItem = this.getStatById(statId);
        if (statItem) {
            const descriptionElement = statItem.querySelector('.statistics__description');
            return descriptionElement ? descriptionElement.textContent : null;
        }
        return null;
    }

    // Method to highlight specific stat
    highlightStat(statId) {
        this.statItems.forEach(item => {
            if (item.dataset.stat === statId) {
                item.style.border = '2px solid var(--primary-green)';
                item.style.borderRadius = '12px';
                item.style.padding = '1rem';
            } else {
                item.style.border = 'none';
                item.style.padding = '0';
            }
        });
    }

    // Method to remove highlight
    removeHighlight() {
        this.statItems.forEach(item => {
            item.style.border = 'none';
            item.style.padding = '0';
        });
    }

    // Method to export statistics data
    exportData() {
        const data = {};
        this.statItems.forEach(item => {
            const statId = item.dataset.stat;
            data[statId] = {
                value: this.getStatValue(statId),
                description: this.getStatDescription(statId)
            };
        });
        return data;
    }

    // Method to emit custom events
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Statistics;
} else {
    window.Statistics = Statistics;
}
