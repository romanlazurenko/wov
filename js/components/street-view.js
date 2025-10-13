class StreetViewAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Animations will work automatically via CSS
        // This class is here for future enhancements if needed
        console.log('Street View animations initialized');
    }

    // Method to replay animations (useful for testing)
    replayAnimations() {
        const elements = document.querySelectorAll('.street-view__step, .street-view__phone');
        elements.forEach(element => {
            // Remove and re-add animation classes to trigger replay
            element.style.animation = 'none';
            element.offsetHeight; // Force reflow
            element.style.animation = null;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StreetViewAnimations();
});
