// Statistics Component Logic
class Statistics {
    constructor() {
        this.statistics = null;
        this.statItems = [];
        this.animated = new Set();
        this.init();
    }

    init() {
        this.statistics = document.querySelector('.statistics');
        if (this.statistics) {
            this.statItems = Array.from(this.statistics.querySelectorAll('.statistics__item'));
            this.bindEvents();
            this.setupIntersectionObserver();
        } else {
            console.warn('Statistics section not found');
        }
    }

    bindEvents() {
        // Add click events for statistics items
        this.statItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleStatClick(item);
            });

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                this.handleStatHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.handleStatHover(item, false);
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateStatValue(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        this.statItems.forEach(item => {
            observer.observe(item);
        });
    }

    animateStatValue(statItem) {
        const valueElement = statItem.querySelector('.statistics__value');
        if (!valueElement) {
            console.warn('No value element found for statistic:', statItem.dataset.stat);
            return;
        }

        const originalValue = valueElement.textContent.trim();
        const statId = statItem.dataset.stat;
        
        // Parse the value and animate accordingly
        this.parseAndAnimateValue(valueElement, originalValue, statId);
    }

    parseAndAnimateValue(element, originalValue, statId) {
        // Handle different value formats
        if (originalValue.includes('%')) {
            this.animatePercentage(element, originalValue);
        } else if (originalValue.includes('x')) {
            this.animateMultiplier(element, originalValue);
        } else if (originalValue.includes('+')) {
            this.animateIncrement(element, originalValue);
        } else {
            // For other formats, just animate the appearance
            this.animateAppearance(element);
        }
    }

    animatePercentage(element, targetValue) {
        const numericValue = parseInt(targetValue.replace('%', ''));
        let currentValue = 0;
        const increment = numericValue / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(currentValue) + '%';
        }, stepTime);
    }

    animateMultiplier(element, targetValue) {
        // For "x2" format, animate from 1 to 2
        const multiplier = parseInt(targetValue.replace('x', ''));
        let currentValue = 1;
        const increment = (multiplier - 1) / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= multiplier) {
                currentValue = multiplier;
                clearInterval(timer);
            }
            element.textContent = 'x' + Math.round(currentValue);
        }, stepTime);
    }

    animateIncrement(element, targetValue) {
        // For "+100%" format, animate from 0 to target
        const numericValue = parseInt(targetValue.replace('+', '').replace('%', ''));
        let currentValue = 0;
        const increment = numericValue / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            element.textContent = '+' + Math.round(currentValue) + '%';
        }, stepTime);
    }

    animateAppearance(element) {
        // For other formats, just add a fade-in and scale effect
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 100);
    }

    handleStatClick(statItem) {
        // Add visual feedback
        this.animateStatClick(statItem);
        
        // Emit custom event
        this.emitEvent('statClicked', {
            statId: statItem.dataset.stat,
            value: statItem.querySelector('.statistics__value').textContent
        });
    }

    handleStatHover(statItem, isHovering) {
        const circle = statItem.querySelector('.statistics__circle');
        if (circle) {
            if (isHovering) {
                circle.style.transform = 'scale(1.1)';
                circle.style.boxShadow = '0 0 30px rgba(96, 255, 160, 0.3)';
            } else {
                circle.style.transform = 'scale(1)';
                circle.style.boxShadow = 'none';
            }
        }
    }

    animateStatClick(statItem) {
        const circle = statItem.querySelector('.statistics__circle');
        if (circle) {
            circle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                circle.style.transform = 'scale(1.1)';
            }, 150);
        }
    }

    // Method to reset all animations
    resetAnimations() {
        this.animated.clear();
        this.statItems.forEach(item => {
            const valueElement = item.querySelector('.statistics__value');
            if (valueElement) {
                valueElement.style.opacity = '1';
                valueElement.style.transform = 'scale(1)';
            }
        });
    }

    // Method to replay animations
    replayAnimations() {
        this.resetAnimations();
        this.statItems.forEach(item => {
            this.animateStatValue(item);
        });
    }

    // Method to get statistics data
    getStatisticsData() {
        return this.statItems.map(item => ({
            id: item.dataset.stat,
            value: item.querySelector('.statistics__value').textContent,
            title: item.querySelector('.statistics__info-title').textContent,
            description: item.querySelector('.statistics__info-description').textContent
        }));
    }

    // Method to update a specific statistic
    updateStatistic(statId, newValue) {
        const statItem = this.statistics.querySelector(`[data-stat="${statId}"]`);
        if (statItem) {
            const valueElement = statItem.querySelector('.statistics__value');
            if (valueElement) {
                valueElement.textContent = newValue;
                // Re-animate the new value
                this.animateStatValue(statItem);
            }
        }
    }

    // Method to check if statistics are visible
    isVisible() {
        const rect = this.statistics.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
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
