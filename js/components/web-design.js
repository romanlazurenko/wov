class WebDesignPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        // Add entrance animations for content blocks
        const blocks = document.querySelectorAll('.web-design__block');
        const title = document.querySelector('.web-design__title');

        // Animate title
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.animation = 'slideInUp 0.8s ease forwards';
            title.style.animationDelay = '0.1s';
        }

        // Animate blocks with staggered delays
        blocks.forEach((block, index) => {
            block.style.opacity = '0';
            block.style.transform = 'translateY(30px)';
            block.style.animation = 'slideInUp 0.6s ease forwards';
            block.style.animationDelay = `${0.3 + (index * 0.2)}s`;
        });

        // Animate project elements
        this.animateProjectElements();
    }

    animateProjectElements() {
        const projectElements = document.querySelectorAll('.projects__gallery');
        
        projectElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.animation = 'slideInUp 0.6s ease forwards';
            element.style.animationDelay = `${0.7 + (index * 0.1)}s`;
        });
    }

    setupInteractions() {

        // Add click effects for list items
        const listItems = document.querySelectorAll('.web-design__list-item');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                this.handleListItemClick(item);
            });
        });

        // Add hover effects for thumbnails
        const thumbnails = document.querySelectorAll('.projects__thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('mouseenter', () => {
                thumbnail.style.transform = 'translateY(-10px) scale(1.01)';
            });
            
            thumbnail.addEventListener('mouseleave', () => {
                thumbnail.style.transform = 'translateY(0) scale(1)';
            });
        });
    }


    handleListItemClick(item) {
        // Add click animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);

        // Add visual feedback
        const title = item.querySelector('.web-design__list-title');
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
        const elements = document.querySelectorAll('.web-design__title, .web-design__block, .projects__gallery');
        
        elements.forEach((element, index) => {
            element.style.animation = 'none';
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.offsetHeight; // Force reflow
            element.style.animation = 'slideInUp 0.6s ease forwards';
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

}

