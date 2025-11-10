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
            this.rightHandDefaultImg = this.rightHand ? this.rightHand.querySelector('.default-hand.desktop-hand') : null;
            this.rightHandActiveImg = this.rightHand ? this.rightHand.querySelector('.active-hand.desktop-hand') : null;
            this.rightHandDefaultImgMobile = this.rightHand ? this.rightHand.querySelector('.default-hand.mobile-hand') : null;
            this.rightHandActiveImgMobile = this.rightHand ? this.rightHand.querySelector('.active-hand.mobile-hand') : null;
            this.phoneScreenAnimation = this.hero.querySelector('.hero__phone-screen-animation');
            this.phoneScreenOverlay = this.hero.querySelector('.hero__phone-screen-overlay');
            this.phoneClickPoint = this.hero.querySelector('.hero__phone-click-point');
            this.phoneExpandingCircle = this.hero.querySelector('.hero__phone-expanding-circle');
            this.bindEvents();
            this.setupParallax();
            this.setupHandSwitchAnimation();
            this.optimizeForMobile();
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
    }

    setupHandSwitchAnimation() {
        const isMobile = window.innerWidth <= 768;
        
        // Start screen fade-in animation 200ms before the click
        setTimeout(() => {
            this.startScreenFadeInAnimation();
        }, 2400);

        // Switch hand image when hands reach their final position (after 2s slideInRight animation)
        setTimeout(() => {
            if (this.rightHand) {
                // Use mobile or desktop images based on device
                const defaultImg = isMobile ? this.rightHandDefaultImgMobile : this.rightHandDefaultImg;
                const activeImg = isMobile ? this.rightHandActiveImgMobile : this.rightHandActiveImg;
                
                if (defaultImg && activeImg) {
                    // Trigger the crossfade effect
                    this.rightHand.classList.add('hand-activated');
                }
            }
            
            // Only trigger left hand click animation on desktop
            if (!isMobile && this.leftHand) {
                this.leftHand.classList.add('hand-clicking');
            }

            // Start smooth screen turn-on animation
            this.startScreenTurnOnAnimation();
        }, 2400);
    }

    startScreenTurnOnAnimation() {
        if (!this.phoneScreenOverlay) return;

        const startTime = Date.now();
        const duration = 1500; // Same duration as desktop for consistent timing
        const isMobile = window.innerWidth <= 768;
        
        // Adjust click point coordinates based on mobile screen positioning
        const clickPointX = isMobile ? 8 : 8; // Same relative position
        const clickPointY = isMobile ? 36 : 36; // Same relative position
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use same cubic easing as desktop for consistent animation feel
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Calculate the radius of the transparent area
            const maxRadius = Math.sqrt(2) * 100;
            const currentRadius = easedProgress * maxRadius;
            
            // Calculate opacity based on distance from click point
            const opacity = Math.max(0, 0.95 - (easedProgress * 0.95));
            
            // Calculate border (same as desktop)
            const borderRadius = Math.max(0, currentRadius - 2);
            const borderOpacity = Math.max(0, 0.8 - (easedProgress * 0.8));
            
            // Use same gradient with green border on both desktop and mobile
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

        // Start fade-in animation 200ms before the click (at 2.2s)
        const startTime = Date.now();
        const duration = 400; // Same duration as desktop for consistent timing
        const initialOpacity = 0;
        const targetOpacity = 1;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use same easing as desktop for consistent animation feel
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            const currentOpacity = initialOpacity + (targetOpacity - initialOpacity) * easedProgress;
            
            this.phoneScreenOverlay.style.opacity = currentOpacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Mobile-specific optimizations
    optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Optimize for performance while maintaining visual consistency
            if (this.phoneScreenOverlay) {
                this.phoneScreenOverlay.style.willChange = 'opacity, background';
            }
            
            // Keep touch effect for visual consistency (but it's lighter on mobile)
            // Touch effect timing is handled in CSS
        }
    }


    setupParallax() {
        // Add parallax scrolling effect with throttling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (this.isInViewport()) {
                        const scrolled = window.pageYOffset;
                        const rate = scrolled * -0.5;
                        // this.hero.style.transform = `translateY(${rate}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScrollIndicatorClick() {
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
            const offset = 112; // Offset in pixels from the top
            const elementPosition = servicesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
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
