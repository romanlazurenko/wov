// Projects Slider Component
class ProjectsSlider {
    constructor(folderName = 'projects') {
        this.folderName = folderName;
        this.projects = [];
        this.currentProjectIndex = 0;
        this.currentImageIndex = 0; // Track current image within project (0-3)
        this.isLoading = true;
        this.init();
    }

    init() {
        // Desktop elements
        this.mainImage = document.getElementById('main-image');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.prevButton = document.querySelector('.projects__gallery--desktop .projects__nav .projects__nav-arrow:first-child');
        this.nextButton = document.querySelector('.projects__gallery--desktop .projects__nav .projects__nav-arrow:last-child');
        this.titleElement = document.querySelector('.projects__gallery--desktop .projects__nav .projects__title');

        // Desktop thumbnail containers
        this.thumbnailLarge = document.getElementById('thumbnail-large');
        this.thumbnailSmall1 = document.getElementById('thumbnail-small-1');
        this.thumbnailSmall2 = document.getElementById('thumbnail-small-2');

        // Mobile elements
        this.mainImageMobile = document.getElementById('main-image-mobile');
        this.loadingIndicatorMobile = document.getElementById('loading-indicator-mobile');
        this.prevButtonMobile = document.querySelector('.projects__gallery--mobile .projects__nav .projects__nav-arrow:first-child');
        this.nextButtonMobile = document.querySelector('.projects__gallery--mobile .projects__nav .projects__nav-arrow:last-child');
        this.titleElementMobile = document.querySelector('.projects__gallery--mobile .projects__nav .projects__title');

        // Mobile thumbnail containers
        this.thumbnailLargeMobile = document.getElementById('thumbnail-large-mobile');
        this.thumbnailSmall1Mobile = document.getElementById('thumbnail-small-1-mobile');
        this.thumbnailSmall2Mobile = document.getElementById('thumbnail-small-2-mobile');

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
        this.loadProjects();
        
        // Listen for language changes to refresh project names
        document.addEventListener('languageChanged', () => {
            this.refreshProjectNames();
        });
    }

    bindEvents() {
        // Desktop navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousProject());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextProject());
        }

        // Mobile navigation buttons
        if (this.prevButtonMobile) {
            this.prevButtonMobile.addEventListener('click', () => this.previousProject());
        }
        if (this.nextButtonMobile) {
            this.nextButtonMobile.addEventListener('click', () => this.nextProject());
        }

        // Modal events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        if (this.modalPrev) {
            this.modalPrev.addEventListener('click', () => this.modalPreviousProject());
        }
        if (this.modalNext) {
            this.modalNext.addEventListener('click', () => this.modalNextProject());
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
                if (e.key === 'ArrowLeft') this.modalPreviousProject();
                if (e.key === 'ArrowRight') this.modalNextProject();
            } else {
                // Modal is closed - handle slider navigation
                if (e.key === 'ArrowLeft') this.previousProject();
                if (e.key === 'ArrowRight') this.nextProject();
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

        // Desktop touch support
        if (this.mainImage) {
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

        // Mobile touch support
        if (this.mainImageMobile) {
            this.mainImageMobile.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            this.mainImageMobile.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                this.handleSwipe(startX, startY, endX, endY);
            });
        }
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if it's a horizontal swipe (not vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousProject();
            } else {
                this.nextProject();
            }
        }
    }

    async loadProjects() {
        try {
            this.showLoading();
            
            // Load 8 project folders (1-8)
            this.projects = [];
            
            for (let i = 1; i <= 8; i++) {
                const project = {
                    id: i,
                    name: this.getProjectName(i),
                    images: {
                        main: `assets/${this.folderName}/${i}/1.jpg`,
                        large: `assets/${this.folderName}/${i}/2.jpg`,
                        small1: `assets/${this.folderName}/${i}/3.jpg`,
                        small2: `assets/${this.folderName}/${i}/4.jpg`
                    }
                };
                this.projects.push(project);
            }

            if (this.projects.length === 0) {
                this.showError('No projects found');
                return;
            }

            // Preload images for the first project only
            this.preloadProjectImages(0).then(() => {
                this.renderSlider();
                this.hideLoading();
            }).catch(error => {
                console.error('Error preloading initial project images:', error);
                // Still render the slider even if preloading fails
                this.renderSlider();
                this.hideLoading();
            });
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects');
        }
    }

    preloadProjectImages(projectIndex) {
        if (projectIndex < 0 || projectIndex >= this.projects.length) return Promise.resolve();
        
        const project = this.projects[projectIndex];
        const promises = [];
        
        Object.values(project.images).forEach(imageSrc => {
            promises.push(new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(imageSrc);
                img.onerror = () => reject(new Error(`Failed to load ${imageSrc}`));
                img.src = imageSrc;
            }));
        });

        return Promise.all(promises);
    }

    getProjectName(projectId) {
        // Get translated project name from language manager
        if (window.languageManager) {
            const translatedName = window.languageManager.getTranslation(`projects.${projectId}.name`);
            if (translatedName && translatedName !== `projects.${projectId}.name`) {
                return translatedName;
            }
        }
        // Fallback to default name
        return `Project ${projectId}`;
    }

    // Method to refresh project names when language changes
    refreshProjectNames() {
        if (this.projects.length === 0) return;
        
        // Update project names with current language
        this.projects.forEach(project => {
            project.name = this.getProjectName(project.id);
        });
        
        // Update the current project title
        this.updateMainImage();
    }

    renderSlider() {
        this.renderThumbnails();
        this.updateMainImage();
        this.updateNavigation();
    }

    renderThumbnails() {
        if (this.projects.length === 0) return;
        
        const currentProject = this.projects[this.currentProjectIndex];
        
        // Render desktop thumbnails
        this.renderThumbnailsForLayout('desktop', currentProject);
        
        // Render mobile thumbnails
        this.renderThumbnailsForLayout('mobile', currentProject);
    }

    renderThumbnailsForLayout(layout, currentProject) {
        const isMobile = layout === 'mobile';
        const suffix = isMobile ? 'Mobile' : '';
        
        const thumbnailLarge = isMobile ? this.thumbnailLargeMobile : this.thumbnailLarge;
        const thumbnailSmall1 = isMobile ? this.thumbnailSmall1Mobile : this.thumbnailSmall1;
        const thumbnailSmall2 = isMobile ? this.thumbnailSmall2Mobile : this.thumbnailSmall2;
        
        // Resolve name from current language each time
        const currentName = this.getProjectName(currentProject.id);
        
        // Clear existing content
        if (thumbnailLarge) thumbnailLarge.innerHTML = '';
        if (thumbnailSmall1) thumbnailSmall1.innerHTML = '';
        if (thumbnailSmall2) thumbnailSmall2.innerHTML = '';
        
        // Remove active classes
        if (thumbnailLarge) thumbnailLarge.classList.remove('projects__thumbnail--active');
        if (thumbnailSmall1) thumbnailSmall1.classList.remove('projects__thumbnail--active');
        if (thumbnailSmall2) thumbnailSmall2.classList.remove('projects__thumbnail--active');
        
        // Render thumbnails for current project
        if (thumbnailLarge) {
            this.renderThumbnail(thumbnailLarge, {
                src: currentProject.images.large,
                alt: `${currentName} - Large`,
                title: currentName
            }, 'large', isMobile);
        }
        
        if (thumbnailSmall1) {
            this.renderThumbnail(thumbnailSmall1, {
                src: currentProject.images.small1,
                alt: `${currentName} - Small 1`,
                title: currentName
            }, 'small1', isMobile);
        }
        
        if (thumbnailSmall2) {
            this.renderThumbnail(thumbnailSmall2, {
                src: currentProject.images.small2,
                alt: `${currentName} - Small 2`,
                title: currentName
            }, 'small2', isMobile);
        }
    }

    renderThumbnail(container, imageData, position, isMobile = false) {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.loading = 'lazy';
        
        container.appendChild(img);
        container.dataset.position = position;
        
        // Map position to image index (0-based)
        const positionToIndex = {
            'large': 1,    // 2.jpg (index 1)
            'small1': 2,   // 3.jpg (index 2)
            'small2': 3    // 4.jpg (index 3)
        };
        
        // On mobile, disable modal preview
        if (!isMobile) {
            // Add click events to open modal with this specific image (desktop only)
            container.addEventListener('click', () => {
                this.currentImageIndex = positionToIndex[position] || 0;
                this.openModal();
            });
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentImageIndex = positionToIndex[position] || 0;
                this.openModal();
            });
        }
    }

    updateMainImage() {
        if (this.projects.length === 0) return;
        
        const currentProject = this.projects[this.currentProjectIndex];
        const currentName = this.getProjectName(currentProject.id);
        
        // Update desktop main image
        if (this.mainImage) {
            this.mainImage.src = currentProject.images.main;
            this.mainImage.alt = `${currentName} - Main`;
            
            // Add click event to main image for modal (starts with first image)
            this.mainImage.addEventListener('click', () => {
                this.currentImageIndex = 0; // Start with main image (1.jpg)
                this.openModal();
            });
        }
        
        // Update mobile main image
        if (this.mainImageMobile) {
            this.mainImageMobile.src = currentProject.images.main;
            this.mainImageMobile.alt = `${currentName} - Main`;
            
            // Do NOT bind modal open on mobile main image
        }
        
        // Update titles
        if (this.titleElement) {
            this.titleElement.textContent = currentName;
        }
        if (this.titleElementMobile) {
            this.titleElementMobile.textContent = currentName;
        }
    }

    updateNavigation() {
        // Re-render thumbnails to show the carousel effect
        this.renderThumbnails();

        // Update desktop navigation buttons state
        if (this.prevButton) {
            this.prevButton.disabled = this.currentProjectIndex === 0;
            this.prevButton.style.opacity = this.currentProjectIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextButton) {
            this.nextButton.disabled = this.currentProjectIndex === this.projects.length - 1;
            this.nextButton.style.opacity = this.currentProjectIndex === this.projects.length - 1 ? '0.5' : '1';
        }

        // Update mobile navigation buttons state
        if (this.prevButtonMobile) {
            this.prevButtonMobile.disabled = this.currentProjectIndex === 0;
            this.prevButtonMobile.style.opacity = this.currentProjectIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextButtonMobile) {
            this.nextButtonMobile.disabled = this.currentProjectIndex === this.projects.length - 1;
            this.nextButtonMobile.style.opacity = this.currentProjectIndex === this.projects.length - 1 ? '0.5' : '1';
        }
    }

    goToProject(index) {
        if (index < 0 || index >= this.projects.length) return;
        
        this.currentProjectIndex = index;
        this.currentImageIndex = 0; // Reset to first image when changing projects
        
        // Preload images for the new project
        this.preloadProjectImages(index).then(() => {
            this.updateMainImage();
            this.updateNavigation();
            
            // Add smooth transition effect
            this.mainImage.style.opacity = '0';
            setTimeout(() => {
                this.mainImage.style.opacity = '1';
            }, 150);
        }).catch(error => {
            console.error('Error preloading project images:', error);
            // Still update the UI even if preloading fails
            this.updateMainImage();
            this.updateNavigation();
        });
    }

    nextProject() {
        if (this.currentProjectIndex < this.projects.length - 1) {
            this.goToProject(this.currentProjectIndex + 1);
        } else {
            // Loop to first project
            this.goToProject(0);
        }
    }

    previousProject() {
        if (this.currentProjectIndex > 0) {
            this.goToProject(this.currentProjectIndex - 1);
        } else {
            // Loop to last project
            this.goToProject(this.projects.length - 1);
        }
    }

    showLoading() {
        this.isLoading = true;
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('hidden');
        }
        if (this.loadingIndicatorMobile) {
            this.loadingIndicatorMobile.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
        }
        if (this.loadingIndicatorMobile) {
            this.loadingIndicatorMobile.classList.add('hidden');
        }
    }

    showError(message) {
        this.hideLoading();
        if (this.thumbnailsContainer) {
            this.thumbnailsContainer.innerHTML = `<p style="color: var(--primary-green); text-align: center; padding: 2rem;">${message}</p>`;
        }
    }

    // Public methods for external control
    getCurrentProjectIndex() {
        return this.currentProjectIndex;
    }

    getTotalProjects() {
        return this.projects.length;
    }

    setFolder(folderName) {
        this.folderName = folderName;
        this.loadProjects();
    }

    // Auto-play functionality (optional)
    startAutoPlay(interval = 5000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextProject();
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
        if (this.projects.length === 0) return;
        
        // Don't reset currentImageIndex here - it should be set by the click handler
        // this.currentImageIndex = 0;
        
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
        if (this.projects.length === 0) return;
        
        const currentProject = this.projects[this.currentProjectIndex];
        const imageKeys = ['main', 'large', 'small1', 'small2'];
        const currentImageKey = imageKeys[this.currentImageIndex];
        
        // Show loading spinner while image loads
        this.modalLoading.classList.remove('hidden');
        this.modalImage.style.opacity = '0';
        
        // Create new image to test if it's already loaded
        const testImg = new Image();
        testImg.onload = () => {
            // Image is already loaded or loads quickly
            this.modalImage.src = currentProject.images[currentImageKey];
            this.modalImage.alt = `${currentProject.name} - ${currentImageKey}`;
            this.modalImage.style.opacity = '1';
            this.modalLoading.classList.add('hidden');
        };
        testImg.onerror = () => {
            // Image failed to load
            this.modalLoading.classList.add('hidden');
            console.error(`Failed to load image: ${currentProject.images[currentImageKey]}`);
        };
        testImg.src = currentProject.images[currentImageKey];
        
        // Update modal info
        if (this.modalTitle) {
            this.modalTitle.textContent = currentProject.name;
        }
        if (this.modalCounter) {
            this.modalCounter.textContent = `${this.currentImageIndex + 1} / 4`;
        }
    }

    updateModalNavigation() {
        if (this.modalPrev) {
            this.modalPrev.disabled = this.currentImageIndex === 0;
        }
        if (this.modalNext) {
            this.modalNext.disabled = this.currentImageIndex === 3; // 4 images per project (0-3)
        }
    }

    modalNextProject() {
        if (this.currentImageIndex < 3) {
            this.currentImageIndex++;
            this.updateModalImage();
            this.updateModalNavigation();
        }
    }

    modalPreviousProject() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            this.updateModalImage();
            this.updateModalNavigation();
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
