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
            this.phoneScreenAnimation = this.hero.querySelector('.hero__phone-screen-animation');
            this.phoneScreenOverlay = this.hero.querySelector('.hero__phone-screen-overlay');
            this.phoneClickPoint = this.hero.querySelector('.hero__phone-click-point');
            this.phoneExpandingCircle = this.hero.querySelector('.hero__phone-expanding-circle');
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
        // Start screen fade-in animation 200ms before the click
        setTimeout(() => {
            this.startScreenFadeInAnimation();
        }, 2300);

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

            // Start smooth screen turn-on animation
            this.startScreenTurnOnAnimation();
        }, 2300);
    }

    startScreenTurnOnAnimation() {
        if (!this.phoneScreenOverlay) return;

        const startTime = Date.now();
        const duration = 1500; // 1.5 seconds
        const clickPointX = 8; // 8% from left
        const clickPointY = 36; // 36% from top

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Calculate the radius of the transparent area
            // Start from 0% and expand to cover the entire screen
            const maxRadius = Math.sqrt(2) * 100; // Diagonal distance to cover entire screen
            const currentRadius = easedProgress * maxRadius;
            
            // Calculate opacity based on distance from click point
            const opacity = Math.max(0, 0.95 - (easedProgress * 0.95));
            
            // Calculate border radius (slightly smaller than transparent area)
            const borderRadius = Math.max(0, currentRadius - 2);
            const borderOpacity = Math.max(0, 0.8 - (easedProgress * 0.8));
            
            // Create smooth radial gradient with green border
            const gradient = `radial-gradient(circle at ${clickPointX}% ${clickPointY}%, 
                transparent ${borderRadius}%, 
                rgba(96, 255, 160, ${borderOpacity}) ${borderRadius + 10}%, 
                rgba(96, 255, 160, ${borderOpacity}) ${borderRadius + 20}%, 
                transparent ${borderRadius + 33}%, 
                rgba(0, 0, 0, ${opacity}) ${currentRadius + 53}%)`;
            
            this.phoneScreenOverlay.style.background = gradient;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - hide overlay
                this.phoneScreenOverlay.style.opacity = '0';
            }
        };

        requestAnimationFrame(animate);
    }

    startScreenFadeInAnimation() {
        if (!this.phoneScreenOverlay) return;

        // Start fade-in animation 200ms before the click (at 2.1s)
        const startTime = Date.now();
        const duration = 400; // 0.4 seconds fade-in
        const initialOpacity = 0;
        const targetOpacity = 1;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth ease-out for fade-in
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            const currentOpacity = initialOpacity + (targetOpacity - initialOpacity) * easedProgress;
            
            this.phoneScreenOverlay.style.opacity = currentOpacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    replayAnimation() {
        // Remove and re-add animation classes to trigger replay
        const elements = [this.leftHand, this.rightHand, this.touchEffect, this.phoneScreenOverlay, this.phoneClickPoint, this.phoneExpandingCircle];
        
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
        this.phoneScreenAnimation = this.hero.querySelector('.hero__phone-screen-animation');
        this.phoneScreenOverlay = this.hero.querySelector('.hero__phone-screen-overlay');
        this.phoneClickPoint = this.hero.querySelector('.hero__phone-click-point');
        this.phoneExpandingCircle = this.hero.querySelector('.hero__phone-expanding-circle');

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
                // this.hero.style.transform = `translateY(${rate}px)`;
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
