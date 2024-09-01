import { initScrollEffects } from './modules/scrollEffects.js';
import { loadGallery } from './modules/gallery.js';

await loadGallery('img/gallery/config.json');
initScrollEffects();