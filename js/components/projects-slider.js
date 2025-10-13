// Projects Slider Component
class ProjectsSlider {
    constructor(folderName = 'projects') {
        this.folderName = folderName;
        this.images = [];
        this.currentIndex = 0;
        this.isLoading = true;
        this.init();
    }

    init() {
        this.mainImage = document.getElementById('main-image');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.prevButton = document.querySelector('.projects__nav .projects__nav-arrow:first-child');
        this.nextButton = document.querySelector('.projects__nav .projects__nav-arrow:last-child');
        this.titleElement = document.querySelector('.projects__nav .projects__title');

        // Thumbnail containers
        this.thumbnailLarge = document.getElementById('thumbnail-large');
        this.thumbnailSmall1 = document.getElementById('thumbnail-small-1');
        this.thumbnailSmall2 = document.getElementById('thumbnail-small-2');

        // Modal elements
        this.modal = document.getElementById('image-modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalTitle = document.getElementById('modal-title');
        this.modalCounter = document.getElementById('modal-counter');
        this.modalClose = document.getElementById('modal-close');
        this.modalPrev = document.getElementById('modal-prev');
        this.modalNext = document.getElementById('modal-next');
        this.modalLoading = document.getElementById('modal-loading');

        this.bindEvents();
        this.loadImages();
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousImage());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextImage());
        }

        // Modal events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        if (this.modalPrev) {
            this.modalPrev.addEventListener('click', () => this.modalPreviousImage());
        }
        if (this.modalNext) {
            this.modalNext.addEventListener('click', () => this.modalNextImage());
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('image-modal__overlay')) {
                    this.closeModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal && this.modal.classList.contains('active')) {
                // Modal is open - handle modal navigation
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.modalPreviousImage();
                if (e.key === 'ArrowRight') this.modalNextImage();
            } else {
                // Modal is closed - handle slider navigation
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });

        // Touch/swipe support
        this.addTouchSupport();
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.mainImage.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.mainImage.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if it's a horizontal swipe (not vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousImage();
            } else {
                this.nextImage();
            }
        }
    }

    async loadImages() {
        try {
            this.showLoading();
            
            // In a real application, you would fetch the list of images from the server
            // For now, we'll use a predefined list or try to detect images
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            const imageNames = this.getImageNames(); // You can modify this method
            
            this.images = imageNames.map((name, index) => ({
                src: `assets/${this.folderName}/${name}`,
                alt: `Project ${index + 1}`,
                title: `Project ${index + 1}`
            }));

            if (this.images.length === 0) {
                this.showError('No images found in the specified folder');
                return;
            }

            await this.preloadImages();
            this.renderSlider();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading images:', error);
            this.showError('Failed to load images');
        }
    }

    getImageNames() {
        // Method 1: Predefined list (recommended for production)
        // Return an array of image filenames
        return [
            '1.jpg',
            '2.jpg', 
            '3.jpg',
            '4.jpg',
            '5.jpg',
            '6.jpg',
        ];

        // Method 2: Dynamic detection (requires server-side support)
        // This would need to be implemented with a server endpoint
        // that returns the list of files in the folder
    }

    preloadImages() {
        const promises = this.images.map(image => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(image);
                img.onerror = () => reject(new Error(`Failed to load ${image.src}`));
                img.src = image.src;
            });
        });

        return Promise.all(promises);
    }

    renderSlider() {
        this.renderThumbnails();
        this.updateMainImage();
        this.updateNavigation();
    }

    renderThumbnails() {
        if (this.images.length === 0) return;
        
        // Get the 3 thumbnails to show
        const thumbnailsToShow = this.getThumbnailsToShow();
        
        // Clear existing content
        this.thumbnailLarge.innerHTML = '';
        this.thumbnailSmall1.innerHTML = '';
        this.thumbnailSmall2.innerHTML = '';
        
        // Remove active classes
        this.thumbnailLarge.classList.remove('projects__thumbnail--active');
        this.thumbnailSmall1.classList.remove('projects__thumbnail--active');
        this.thumbnailSmall2.classList.remove('projects__thumbnail--active');
        
        // Render large thumbnail (first image)
        if (thumbnailsToShow[0]) {
            this.renderThumbnail(this.thumbnailLarge, thumbnailsToShow[0], 0);
        }
        
        // Render small thumbnails (second and third images)
        if (thumbnailsToShow[1]) {
            this.renderThumbnail(this.thumbnailSmall1, thumbnailsToShow[1], 1);
        }
        
        if (thumbnailsToShow[2]) {
            this.renderThumbnail(this.thumbnailSmall2, thumbnailsToShow[2], 2);
        }
    }

    renderThumbnail(container, imageData, position) {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.loading = 'lazy';
        
        container.appendChild(img);
        container.dataset.index = imageData.originalIndex;
        
        // Add active class if this is the current image
        if (imageData.isActive) {
            container.classList.add('projects__thumbnail--active');
        }
        
        // Add click events
        container.addEventListener('click', () => this.goToImage(imageData.originalIndex));
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            this.goToImage(imageData.originalIndex);
            this.openModal();
        });
    }

    getThumbnailsToShow() {
        const totalImages = this.images.length;
        if (totalImages === 0) return [];
        
        // Always return exactly 3 thumbnails
        const thumbnails = [];
        
        if (totalImages <= 3) {
            // If we have 3 or fewer images, show all of them
            for (let i = 0; i < totalImages; i++) {
                thumbnails.push({
                    ...this.images[i],
                    originalIndex: i,
                    isActive: i === this.currentIndex
                });
            }
        } else {
            // If we have more than 3 images, show current and adjacent images
            let startIndex = this.currentIndex - 1;
            
            // Adjust start index to ensure we always show 3 images
            if (startIndex < 0) {
                startIndex = 0;
            } else if (startIndex + 2 >= totalImages) {
                startIndex = totalImages - 3;
            }
            
            for (let i = 0; i < 3; i++) {
                const imageIndex = startIndex + i;
                thumbnails.push({
                    ...this.images[imageIndex],
                    originalIndex: imageIndex,
                    isActive: imageIndex === this.currentIndex
                });
            }
        }
        
        return thumbnails;
    }

    updateMainImage() {
        if (this.images.length === 0) return;
        
        const currentImage = this.images[this.currentIndex];
        this.mainImage.src = currentImage.src;
        this.mainImage.alt = currentImage.alt;
        
        // Add click event to main image for modal
        this.mainImage.addEventListener('click', () => this.openModal());
        
        // Update title
        if (this.titleElement) {
            this.titleElement.textContent = currentImage.title || `Image ${this.currentIndex + 1}`;
        }
    }

    updateNavigation() {
        // Re-render thumbnails to show the carousel effect
        this.renderThumbnails();

        // Update navigation buttons state
        if (this.prevButton) {
            this.prevButton.disabled = this.currentIndex === 0;
            this.prevButton.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextButton) {
            this.nextButton.disabled = this.currentIndex === this.images.length - 1;
            this.nextButton.style.opacity = this.currentIndex === this.images.length - 1 ? '0.5' : '1';
        }
    }

    goToImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        this.currentIndex = index;
        this.updateMainImage();
        this.updateNavigation();
        
        // Add smooth transition effect
        this.mainImage.style.opacity = '0';
        setTimeout(() => {
            this.mainImage.style.opacity = '1';
        }, 150);
    }

    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.goToImage(this.currentIndex + 1);
        } else {
            // Loop to first image
            this.goToImage(0);
        }
    }

    previousImage() {
        if (this.currentIndex > 0) {
            this.goToImage(this.currentIndex - 1);
        } else {
            // Loop to last image
            this.goToImage(this.images.length - 1);
        }
    }

    showLoading() {
        this.isLoading = true;
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    showError(message) {
        this.hideLoading();
        if (this.thumbnailsContainer) {
            this.thumbnailsContainer.innerHTML = `<p style="color: var(--primary-green); text-align: center; padding: 2rem;">${message}</p>`;
        }
    }

    // Public methods for external control
    getCurrentIndex() {
        return this.currentIndex;
    }

    getTotalImages() {
        return this.images.length;
    }

    setFolder(folderName) {
        this.folderName = folderName;
        this.loadImages();
    }

    // Auto-play functionality (optional)
    startAutoPlay(interval = 5000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Modal methods
    openModal() {
        if (this.images.length === 0) return;
        
        this.modal.classList.add('active');
        this.updateModalImage();
        this.updateModalNavigation();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    updateModalImage() {
        if (this.images.length === 0) return;
        
        const currentImage = this.images[this.currentIndex];
        
        // Since images are already preloaded, we can set them directly
        this.modalImage.src = currentImage.src;
        this.modalImage.alt = currentImage.alt;
        this.modalImage.style.opacity = '1';
        
        // Hide loading spinner immediately since images are preloaded
        this.modalLoading.classList.add('hidden');
        
        // Update modal info
        if (this.modalTitle) {
            this.modalTitle.textContent = currentImage.title || `Image ${this.currentIndex + 1}`;
        }
        if (this.modalCounter) {
            this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
    }

    updateModalNavigation() {
        if (this.modalPrev) {
            this.modalPrev.disabled = this.currentIndex === 0;
        }
        if (this.modalNext) {
            this.modalNext.disabled = this.currentIndex === this.images.length - 1;
        }
    }

    modalNextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateModalImage();
            this.updateModalNavigation();
            // Update thumbnails in the main slider
            this.renderThumbnails();
        }
    }

    modalPreviousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateModalImage();
            this.updateModalNavigation();
            // Update thumbnails in the main slider
            this.renderThumbnails();
        }
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Change 'projects' to your desired folder name
    window.projectsSlider = new ProjectsSlider('projects');
    
    // Optional: Start auto-play
    // window.projectsSlider.startAutoPlay(5000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsSlider;
} else {
    window.ProjectsSlider = ProjectsSlider;
}
