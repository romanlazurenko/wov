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
        // Desktop elements - mainImage will be created dynamically
        this.mainImage = null;
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.prevButton = document.querySelector('.projects__gallery--desktop .projects__nav .projects__nav-arrow:first-child');
        this.nextButton = document.querySelector('.projects__gallery--desktop .projects__nav .projects__nav-arrow:last-child');
        this.titleElement = document.querySelector('.projects__gallery--desktop .projects__nav .projects__title');

        // Desktop thumbnail containers
        this.thumbnailLarge = document.getElementById('thumbnail-large');
        this.thumbnailSmall1 = document.getElementById('thumbnail-small-1');
        this.thumbnailSmall2 = document.getElementById('thumbnail-small-2');

        // Mobile elements - mainImageMobile will be created dynamically
        this.mainImageMobile = null;
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

        // Desktop touch support - only for image containers, not iframes
        const mainImageContainer = document.getElementById('main-image-container');
        if (mainImageContainer) {
            mainImageContainer.addEventListener('touchstart', (e) => {
                // Skip if touching an iframe
                if (e.target.tagName === 'IFRAME' || e.target.closest('.projects__iframe')) {
                    return;
                }
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            mainImageContainer.addEventListener('touchend', (e) => {
                // Skip if touching an iframe
                if (e.target.tagName === 'IFRAME' || e.target.closest('.projects__iframe')) {
                    return;
                }
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                this.handleSwipe(startX, startY, endX, endY);
            });
        }

        // Mobile touch support - only for image containers, not iframes
        const mainImageContainerMobile = document.getElementById('main-image-container-mobile');
        if (mainImageContainerMobile) {
            mainImageContainerMobile.addEventListener('touchstart', (e) => {
                // Skip if touching an iframe
                if (e.target.tagName === 'IFRAME' || e.target.closest('.projects__iframe')) {
                    return;
                }
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            mainImageContainerMobile.addEventListener('touchend', (e) => {
                // Skip if touching an iframe
                if (e.target.tagName === 'IFRAME' || e.target.closest('.projects__iframe')) {
                    return;
                }
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
            this.projects = [];
            
            
            // Check if using street-view folder (new logic) or projects folder (old logic)
            if (this.folderName === 'street-view') {
                // NEW LOGIC: Load from street-view folder with named folders
                const projectFolders = ['Gabrelians', 'Massovka', 'Smile Eliska', 'Tvoje saty', 'Zelva'];
                
                // Manual iframe embed URLs for 3D tours
                // To add/update: Extract the 'src' URL from your iframe code and paste it here
                // Format: 'FolderName': 'https://www.google.com/maps/embed?pb=...'
                const iframeEmbedUrls = {
                    'Gabrelians': 'https://www.google.com/maps/embed?pb=!4v1763579571206!6m8!1m7!1sCAoSHENJQUJJaEF5c0Q1emdEb1k2WUxZRjVybXNZTjA.!2m2!1d50.10529092543041!2d14.48616939078733!3f193.85!4f-9.200000000000003!5f0.7820865974627469',
                    'Massovka': 'https://www.google.com/maps/embed?pb=!4v1763579617293!6m8!1m7!1sCAoSHENJQUJJaEJMSjZKdU1OdGNweUhKSHFoTGcxWUY.!2m2!1d50.07513052828875!2d14.43955664209942!3f226.51!4f-13.280000000000001!5f1.0895987545872123',
                    'Smile Eliska': 'https://www.google.com/maps/embed?pb=!4v1763579639008!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2ZpdENnT2c.!2m2!1d50.10530084068235!2d14.50214069167442!3f200.99!4f-6.719999999999999!5f0.7820865974627469',
                    'Tvoje saty': 'https://www.google.com/maps/embed?pb=!4v1763579664534!6m8!1m7!1sCAoSHENJQUJJaEN6VDNQcl96YjBvNFdTNE5FMU5wcDc.!2m2!1d50.10393529502511!2d14.4435874260284!3f300.02!4f-10.659999999999997!5f0.7820865974627469',
                    'Zelva': 'https://www.google.com/maps/embed?pb=!4v1763579701904!6m8!1m7!1sCAoSHENJQUJJaEFEeWNPMkVSU2Z5MmVrclM0QUJELVM.!2m2!1d50.08746742992069!2d14.46911704221197!3f57.68!4f-5.170000000000002!5f0.7820865974627469'
                };
                
                // Load each project folder
                for (let i = 0; i < projectFolders.length; i++) {
                    const folderName = projectFolders[i];
                    // Get translated name - will be refreshed after language manager is ready
                    const project = {
                        id: i + 1,
                        folderName: folderName,
                        name: folderName, // Temporary name, will be updated by refreshProjectNames()
                        weblink: iframeEmbedUrls[folderName] || null, // Get iframe URL from manual array
                        images: {
                            main: `assets/${this.folderName}/${folderName}/1.jpg`,
                            large: `assets/${this.folderName}/${folderName}/2.jpg`,
                            small1: `assets/${this.folderName}/${folderName}/3.jpg`
                        }
                    };
                    
                    this.projects.push(project);
                }
            } else {
                // OLD LOGIC: Load from projects folder with numbered folders (1-8)
                for (let i = 1; i <= 8; i++) {
                    // Get translated name - will be refreshed after language manager is ready
                    const project = {
                        id: i,
                        name: `Project ${i}`, // Temporary name, will be updated by refreshProjectNames()
                        weblink: null, // No weblink for old projects
                        images: {
                            main: `assets/${this.folderName}/${i}/1.jpg`,
                            large: `assets/${this.folderName}/${i}/2.jpg`,
                            small1: `assets/${this.folderName}/${i}/3.jpg`,
                            small2: `assets/${this.folderName}/${i}/4.jpg`
                        }
                    };
                    this.projects.push(project);
                }
            }

            if (this.projects.length === 0) {
                this.showError('No projects found');
                return;
            }

            // Preload images for the first project only
            this.preloadProjectImages(0).then(() => {
                // Refresh project names after language manager is ready
                this.refreshProjectNames();
                this.renderSlider();
                this.hideLoading();
            }).catch(error => {
                console.error('Error preloading initial project images:', error);
                // Refresh project names after language manager is ready
                this.refreshProjectNames();
                // Still render the slider even if preloading fails
                this.renderSlider();
                this.hideLoading();
            });
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects');
        }
    }

    parseWeblinkText(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const result = { name: null, link: null };
        
        // Look for Google Maps link (contains maps.app.goo.gl or google.com/maps)
        const linkPattern = /(https?:\/\/[^\s]+)/;
        const linkMatch = text.match(linkPattern);
        if (linkMatch) {
            result.link = linkMatch[1];
        }
        
        // Look for project name - it's usually the longest non-link line
        for (const line of lines) {
            if (!linkPattern.test(line) && line.length > 3) {
                // This might be the project name
                if (!result.name || line.length > result.name.length) {
                    result.name = line;
                }
            }
        }
        
        return result;
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
        // First check if we have a project with this ID and use its name
        const project = this.projects.find(p => p.id === projectId);
        if (project && project.name) {
            return project.name;
        }
        
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
        
        if (!window.languageManager) {
            console.warn('LanguageManager not available, skipping project name refresh');
            return;
        }
        
        
        // Update project names with current language
        this.projects.forEach(project => {
            if (this.folderName === 'street-view') {
                // Street-view projects use folder name as key
                if (project.folderName) {
                    const translationKey = `street-view-projects.${project.folderName}`;
                    const translatedName = window.languageManager.getTranslation(translationKey);
                    
                    if (translatedName && translatedName !== translationKey) {
                        project.name = translatedName;
                    } else {
                        // Fallback to folder name if translation not found
                        project.name = project.folderName;
                    }
                }
            } else {
                // Web-design projects use project ID
                const translationKey = `projects.${project.id}.name`;
                const translatedName = window.languageManager.getTranslation(translationKey);
                
                if (translatedName && translatedName !== translationKey) {
                    project.name = translatedName;
                } else {
                    // Fallback to default name
                    project.name = `Project ${project.id}`;
                }
            }
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
        const currentName = currentProject.name || this.getProjectName(currentProject.id);
        
        // Clear existing content
        if (thumbnailLarge) thumbnailLarge.innerHTML = '';
        if (thumbnailSmall1) thumbnailSmall1.innerHTML = '';
        if (thumbnailSmall2) thumbnailSmall2.innerHTML = '';
        
        // Remove active classes
        if (thumbnailLarge) thumbnailLarge.classList.remove('projects__thumbnail--active');
        if (thumbnailSmall1) thumbnailSmall1.classList.remove('projects__thumbnail--active');
        if (thumbnailSmall2) thumbnailSmall2.classList.remove('projects__thumbnail--active');
        
        // For street-view (3 images): show main, large, small1
        // For projects (4 images): show large, small1, small2 (main is in main container)
        const isStreetView = this.folderName === 'street-view';
        
        if (isStreetView) {
            // Street-view: Show main (1.jpg), large (2.jpg), small1 (3.jpg) as thumbnails
            if (thumbnailLarge && currentProject.images.main) {
                this.renderThumbnail(thumbnailLarge, {
                    src: currentProject.images.main,
                    alt: `${currentName} - Main`,
                    title: currentName
                }, 'main', isMobile);
            }
            
            if (thumbnailSmall1 && currentProject.images.large) {
                this.renderThumbnail(thumbnailSmall1, {
                    src: currentProject.images.large,
                    alt: `${currentName} - Large`,
                    title: currentName
                }, 'large', isMobile);
            }
            
            if (thumbnailSmall2 && currentProject.images.small1) {
                thumbnailSmall2.style.display = ''; // Show for street-view
                this.renderThumbnail(thumbnailSmall2, {
                    src: currentProject.images.small1,
                    alt: `${currentName} - Small 1`,
                    title: currentName
                }, 'small1', isMobile);
            }
        } else {
            // Old logic: Show large (2.jpg), small1 (3.jpg), small2 (4.jpg) as thumbnails
            if (thumbnailLarge && currentProject.images.large) {
                this.renderThumbnail(thumbnailLarge, {
                    src: currentProject.images.large,
                    alt: `${currentName} - Large`,
                    title: currentName
                }, 'large', isMobile);
            }
            
            if (thumbnailSmall1 && currentProject.images.small1) {
                this.renderThumbnail(thumbnailSmall1, {
                    src: currentProject.images.small1,
                    alt: `${currentName} - Small 1`,
                    title: currentName
                }, 'small1', isMobile);
            }
            
            if (thumbnailSmall2) {
                if (currentProject.images.small2) {
                    thumbnailSmall2.style.display = ''; // Show if image exists
                    this.renderThumbnail(thumbnailSmall2, {
                        src: currentProject.images.small2,
                        alt: `${currentName} - Small 2`,
                        title: currentName
                    }, 'small2', isMobile);
                } else {
                    thumbnailSmall2.style.display = 'none'; // Hide if no image
                }
            }
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
        // For street-view: main=0, large=1, small1=2
        // For projects: large=1, small1=2, small2=3
        const isStreetView = this.folderName === 'street-view';
        const positionToIndex = isStreetView ? {
            'main': 0,    // 1.jpg (index 0)
            'large': 1,   // 2.jpg (index 1)
            'small1': 2   // 3.jpg (index 2)
        } : {
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
        const currentName = currentProject.name || this.getProjectName(currentProject.id);
        
        // Get main image containers
        const mainImageContainer = document.getElementById('main-image-container');
        const mainImageContainerMobile = document.getElementById('main-image-container-mobile');
        
        // Update desktop main image/iframe
        if (mainImageContainer) {
            mainImageContainer.innerHTML = ''; // Clear container
            
            // Remove any existing click handlers
            mainImageContainer.onclick = null;
            
            if (currentProject.weblink) {
                // Show iframe for 3D view
                const iframe = document.createElement('iframe');
                iframe.src = currentProject.weblink;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '12px';
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('loading', 'lazy');
                iframe.className = 'projects__iframe';
                mainImageContainer.appendChild(iframe);
                
                // Remove click handler - iframe should be interactive
                mainImageContainer.style.cursor = 'default';
                mainImageContainer.style.pointerEvents = 'none'; // Container doesn't capture clicks
                iframe.style.pointerEvents = 'auto'; // Iframe captures clicks
            } else {
                // Show image
                const img = document.createElement('img');
                img.id = 'main-image';
                img.src = currentProject.images.main;
                img.alt = `${currentName} - Main`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                mainImageContainer.appendChild(img);
                
                // Store reference and add click event
                this.mainImage = img;
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.currentImageIndex = 0; // Start with main image (1.jpg)
                    this.openModal();
                });
                mainImageContainer.style.cursor = 'pointer';
                mainImageContainer.style.pointerEvents = 'auto';
            }
        }
        
        // Update mobile main image/iframe
        if (mainImageContainerMobile) {
            mainImageContainerMobile.innerHTML = ''; // Clear container
            
            // Remove any existing click handlers
            mainImageContainerMobile.onclick = null;
            
            if (currentProject.weblink) {
                // Show iframe for 3D view
                const iframe = document.createElement('iframe');
                iframe.src = currentProject.weblink;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '12px';
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('loading', 'lazy');
                iframe.className = 'projects__iframe';
                mainImageContainerMobile.appendChild(iframe);
                
                // Remove click handler - iframe should be interactive
                mainImageContainerMobile.style.cursor = 'default';
                mainImageContainerMobile.style.pointerEvents = 'none'; // Container doesn't capture clicks
                iframe.style.pointerEvents = 'auto'; // Iframe captures clicks
            } else {
                // Show image
                const img = document.createElement('img');
                img.id = 'main-image-mobile';
                img.src = currentProject.images.main;
                img.alt = `${currentName} - Main`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                mainImageContainerMobile.appendChild(img);
                
                // Store reference (no modal on mobile)
                this.mainImageMobile = img;
                mainImageContainerMobile.style.cursor = 'default';
                mainImageContainerMobile.style.pointerEvents = 'auto';
            }
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
        
        // Allow modal to show images even if project has iframe
        // The iframe is shown in main image, but thumbnails can still open modal
        
        // Determine image keys based on folder type
        const isStreetView = this.folderName === 'street-view';
        const imageKeys = isStreetView
            ? ['main', 'large', 'small1']  // Street-view: 3 images
            : ['main', 'large', 'small1', 'small2']; // Projects: 4 images (if small2 exists)
        
        // Filter out undefined keys
        const validImageKeys = imageKeys.filter(key => currentProject.images[key]);
        const maxImages = validImageKeys.length;
        
        // Ensure currentImageIndex is within bounds
        if (this.currentImageIndex >= maxImages) {
            this.currentImageIndex = maxImages - 1;
        }
        if (this.currentImageIndex < 0) {
            this.currentImageIndex = 0;
        }
        
        const currentImageKey = validImageKeys[this.currentImageIndex];
        
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
            this.modalCounter.textContent = `${this.currentImageIndex + 1} / ${maxImages}`;
        }
    }

    updateModalNavigation() {
        const currentProject = this.projects[this.currentProjectIndex];
        
        // Determine max images based on folder type
        const isStreetView = this.folderName === 'street-view';
        const maxImages = isStreetView ? 3 : (currentProject.images.small2 ? 4 : 3);
        
        if (this.modalPrev) {
            this.modalPrev.disabled = this.currentImageIndex === 0;
        }
        if (this.modalNext) {
            this.modalNext.disabled = this.currentImageIndex >= maxImages - 1;
        }
    }

    modalNextProject() {
        const currentProject = this.projects[this.currentProjectIndex];
        
        // Determine max images based on folder type
        const isStreetView = this.folderName === 'street-view';
        const maxImages = isStreetView ? 3 : (currentProject.images.small2 ? 4 : 3);
        
        if (this.currentImageIndex < maxImages - 1) {
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
    // Prevent double initialization
    if (window.projectsSlider) {
        console.warn('ProjectsSlider already initialized, skipping...');
        return;
    }
    
    // Check if we're on street-view page - check multiple ways for reliability
    const pathname = window.location.pathname;
    const href = window.location.href;
    const filename = pathname.split('/').pop() || '';
    
    const isStreetViewPage = pathname.includes('street-view') || 
                            href.includes('street-view') || 
                            filename === 'street-view.html' ||
                            filename.startsWith('street-view');
    
    const folderName = isStreetViewPage ? 'street-view' : 'projects';
    
    // Wait a bit for language manager to initialize
    const initSlider = () => {
        window.projectsSlider = new ProjectsSlider(folderName);
        
        // Refresh project names after a short delay to ensure language manager is ready
        setTimeout(() => {
            if (window.projectsSlider && window.languageManager) {
                window.projectsSlider.refreshProjectNames();
            }
        }, 100);
    };
    
    // If language manager is already available, initialize immediately
    if (window.languageManager) {
        initSlider();
    } else {
        // Otherwise wait a bit for it to initialize
        setTimeout(initSlider, 50);
    }
    
    // Optional: Start auto-play
    // window.projectsSlider.startAutoPlay(5000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsSlider;
} else {
    window.ProjectsSlider = ProjectsSlider;
}
