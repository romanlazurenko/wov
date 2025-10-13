// Hero Component Logic
class Hero {
    constructor() {
        this.hero = null;
        this.scrollIndicator = null;
        this.init();
    }

    init() {
        this.hero = document.querySelector('.hero');
        if (this.hero) {
            this.scrollIndicator = this.hero.querySelector('.hero__scroll-indicator');
            this.leftHand = this.hero.querySelector('.hero__left-hand');
            this.rightHand = this.hero.querySelector('.hero__right-hand');
            this.rightHandDefaultImg = this.rightHand ? this.rightHand.querySelector('.default-hand') : null;
            this.rightHandActiveImg = this.rightHand ? this.rightHand.querySelector('.active-hand') : null;
            this.touchEffect = this.hero.querySelector('.hero__touch-effect');
            this.bindEvents();
            this.setupParallax();
            this.setupAnimationReplay();
            this.setupHandSwitchAnimation();
        }
    }

    bindEvents() {
        // Scroll indicator functionality
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.handleScrollIndicatorClick();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && this.isInViewport()) {
                this.handleScrollIndicatorClick();
            }
        });

        // Replay animation on click
        if (this.leftHand) {
            this.leftHand.addEventListener('click', () => {
                this.replayAnimation();
            });
        }

        if (this.rightHand) {
            this.rightHand.addEventListener('click', () => {
                this.replayAnimation();
            });
        }
    }

    setupAnimationReplay() {
        // Set up Intersection Observer to replay animation when hero comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Only replay if user scrolled away and came back
                    if (this.hasScrolledAway) {
                        this.replayAnimation();
                        this.hasScrolledAway = false;
                    }
                } else if (!entry.isIntersecting) {
                    this.hasScrolledAway = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.hero);
    }

    setupHandSwitchAnimation() {
        // Switch hand image when hands reach their final position (after 2s slideInRight animation)
        setTimeout(() => {
            if (this.rightHandDefaultImg && this.rightHandActiveImg && this.rightHand) {
                // Trigger the crossfade effect
                this.rightHand.classList.add('hand-activated');
            }
            
            // Trigger left hand click animation
            if (this.leftHand) {
                this.leftHand.classList.add('hand-clicking');
            }
        }, 2300);
    }

    replayAnimation() {
        // Remove and re-add animation classes to trigger replay
        const elements = [this.leftHand, this.rightHand, this.touchEffect];
        
        elements.forEach(el => {
            if (el) {
                // Clone and replace to restart animation
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
            }
        });

        // Re-cache the elements
        this.leftHand = this.hero.querySelector('.hero__left-hand');
        this.rightHand = this.hero.querySelector('.hero__right-hand');
        this.rightHandDefaultImg = this.rightHand ? this.rightHand.querySelector('.default-hand') : null;
        this.rightHandActiveImg = this.rightHand ? this.rightHand.querySelector('.active-hand') : null;
        this.touchEffect = this.hero.querySelector('.hero__touch-effect');

        // Reset right hand to default state
        if (this.rightHand) {
            this.rightHand.classList.remove('hand-activated');
        }
        
        // Reset left hand to default state
        if (this.leftHand) {
            this.leftHand.classList.remove('hand-clicking');
        }

        // Re-bind click events
        if (this.leftHand) {
            this.leftHand.addEventListener('click', () => this.replayAnimation());
        }
        if (this.rightHand) {
            this.rightHand.addEventListener('click', () => this.replayAnimation());
        }

        // Re-setup hand switch animation
        this.setupHandSwitchAnimation();

        // Emit custom event
        this.emitEvent('animationReplayed', { timestamp: Date.now() });
    }

    setupParallax() {
        // Add parallax scrolling effect
        window.addEventListener('scroll', () => {
            if (this.isInViewport()) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                this.hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    handleScrollIndicatorClick() {
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
            servicesSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // Emit custom event
        this.emitEvent('scrollIndicatorClicked', { target: 'services' });
    }

    // Method to check if hero is in viewport
    isInViewport() {
        const rect = this.hero.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Method to update hero content
    updateContent(title, tag) {
        const titleElement = this.hero.querySelector('.hero__title');
        const tagElement = this.hero.querySelector('.hero__tag');
        
        if (title && titleElement) {
            titleElement.innerHTML = title;
        }
        
        if (tag && tagElement) {
            tagElement.textContent = tag;
        }

        // Emit custom event
        this.emitEvent('contentUpdated', { title, tag });
    }

    // Method to change background image
    updateBackground(imageUrl) {
        if (imageUrl) {
            this.hero.style.backgroundImage = `linear-gradient(rgba(46, 50, 48, 0.7), rgba(46, 50, 48, 0.7)), url(${imageUrl})`;
            
            // Emit custom event
            this.emitEvent('backgroundUpdated', { imageUrl });
        }
    }

    // Method to add video background
    addVideoBackground(videoUrl) {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '-1';
        
        this.hero.appendChild(video);
        
        // Emit custom event
        this.emitEvent('videoBackgroundAdded', { videoUrl });
    }

    // Method to animate elements on scroll
    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        const animatedElements = this.hero.querySelectorAll('.hero__tag, .hero__title');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Method to show/hide scroll indicator
    toggleScrollIndicator(show) {
        if (this.scrollIndicator) {
            this.scrollIndicator.style.display = show ? 'flex' : 'none';
        }
    }

    // Method to update scroll indicator target
    updateScrollTarget(targetSelector) {
        this.scrollTarget = targetSelector;
    }

    // Method to get hero dimensions
    getDimensions() {
        return {
            width: this.hero.offsetWidth,
            height: this.hero.offsetHeight,
            top: this.hero.offsetTop
        };
    }

    // Method to check if hero is visible
    isVisible() {
        const rect = this.hero.getBoundingClientRect();
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
    module.exports = Hero;
} else {
    window.Hero = Hero;
}
