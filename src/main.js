import './style.css'
import Router from './router.js'
import { renderHome } from './views/home.js'
import { renderAbout } from './views/about.js'

// Initialize router
const router = new Router();

// Make router globally available
window.router = router;

// Define routes
router.addRoute('/', renderHome);
router.addRoute('/about', renderAbout);

// Start the application
router.navigate(window.location.pathname);
