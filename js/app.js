/**
 * @module pishockbooks
 * @description Entry point for pishockbooks online website application features.
 * @author Michael Langford
 * @version 1.0.0
 */

import { initScrollEffects } from './modules/scrollEffects.js';
import { loadGallery } from './modules/gallery.js';

/**
 * Loads the gallery configuration from a JSON file and initializes scroll effects.
 * This function is called once the module has been loaded and is responsible for setting up
 * the initial state of the application.
 * 
 * @async
 * @function initializeApp
 * @returns {Promise<void>} Resolves when both the gallery and scroll effects are initialized.
 */
const initializeApp = async () => {
    // Load gallery configuration
    await loadGallery('img/gallery/config.json');

    // Initialize scroll effects
    initScrollEffects();
};

// Execute the initialization function
initializeApp();
