# Way of Visionary - Modular Website

A modern, modular website built with vanilla JavaScript and CSS, designed for easy mobile development and maintenance.

## 🎨 Color Scheme

- **Primary Green**: `#60FFA0`
- **Light Gray**: `#F0F0F0` 
- **Dark Gray**: `#2E3230`
- **Medium Gray**: `#3A3E3C`

## 📁 Project Structure

```
wov/
├── index.html              # Main HTML file
├── styles.css              # Main CSS styles
├── mobile.css              # Mobile-specific styles
├── app.js                  # Main application module
├── components/             # Component modules
│   ├── header.js          # Header component
│   ├── hero.js            # Hero section component
│   ├── services.js        # Services component
│   ├── statistics.js      # Statistics component
│   └── footer.js          # Footer component
└── README.md              # This file
```

## 🧩 Component Architecture

### Header Component (`components/header.js`)
- Fixed navigation with logo
- Dropdown menu for services
- Language selector
- CTA button
- Mobile menu support (ready for mobile version)

### Hero Component (`components/hero.js`)
- Full-screen hero section
- Animated scroll indicator
- Parallax effects
- Content customization methods

### Services Component (`components/services.js`)
- Service cards grid
- Interactive hover effects
- Modal for service details
- Dynamic service management

### Statistics Component (`components/statistics.js`)
- Animated statistics circles
- Scroll-triggered animations
- Counter animations
- Data import/export

### Footer Component (`components/footer.js`)
- Contact information
- Social media links
- Service links
- Contact form modal
- Copy-to-clipboard functionality

## 🚀 Getting Started

1. **Open the website**: Simply open `index.html` in a web browser
2. **Development**: All components are modular and can be modified independently
3. **Mobile Development**: Use `mobile.css` for mobile-specific styles

## 📱 Mobile Development

The project is structured for easy mobile development:

- **Separate mobile CSS**: `mobile.css` contains all mobile-specific styles
- **Responsive components**: All components are mobile-ready
- **Touch interactions**: Optimized for touch devices
- **Performance**: Reduced animations and optimized for mobile

### Mobile Features Ready:
- Mobile menu toggle
- Touch-friendly interactions
- Responsive grids
- Mobile-optimized modals
- Accessibility features

## 🔧 Component Usage

### Basic Usage
```javascript
// Initialize a component
const header = new Header();
header.render(document.getElementById('app'));

// Update component data
header.updateLanguage('EN');

// Listen for events
document.addEventListener('serviceSelected', (e) => {
    console.log('Service selected:', e.detail);
});
```

### Advanced Usage
```javascript
// Get component instance
const services = app.getComponent('services');

// Add new service
services.addService({
    id: 'new-service',
    title: 'New Service',
    description: 'Service description',
    icon: 'fas fa-icon'
});

// Filter services
services.filterServices('web');
```

## 🎯 Features

### Current Features
- ✅ Modular component architecture
- ✅ Responsive design
- ✅ Smooth scrolling navigation
- ✅ Interactive animations
- ✅ Mobile-ready structure
- ✅ SEO optimized
- ✅ Accessibility features

### Ready for Mobile Development
- ✅ Mobile-specific CSS file
- ✅ Touch interactions
- ✅ Mobile menu structure
- ✅ Performance optimizations
- ✅ Mobile accessibility

## 🛠️ Customization

### Adding New Components
1. Create a new component file in `components/`
2. Follow the existing component pattern
3. Add to `app.js` initialization
4. Include in `index.html`

### Styling
- Main styles: `styles.css`
- Mobile styles: `mobile.css`
- CSS variables for easy color changes
- BEM methodology for class naming

### Data Management
- Each component can manage its own data
- Import/export functionality available
- Event-driven communication between components

## 📊 Analytics Ready

The app includes analytics tracking for:
- Service selections
- CTA button clicks
- Social media clicks
- User interactions

## 🔒 Security Features

- XSS protection in form handling
- Secure external link handling
- Input validation in contact forms

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Progressive enhancement approach

## 📈 Performance

- Optimized for mobile devices
- Reduced motion support
- Efficient animations
- Minimal dependencies

## 🤝 Contributing

1. Follow the existing component pattern
2. Use BEM CSS methodology
3. Add mobile styles to `mobile.css`
4. Test on mobile devices
5. Maintain accessibility standards

## 📝 License

This project is proprietary to Way of Visionary.

---

**Built with ❤️ for modern web development**
