/**
 * Configuration object for lightbox functionality and debug settings.
 * @typedef {Object} Settings
 * @property {number} startX - The starting X coordinate for touch events.
 * @property {number} endX - The ending X coordinate for touch events.
 * @property {boolean} isOpen - Indicates if the lightbox is currently open.
 * @property {boolean} openable - Indicates if the lightbox can be opened.
 * @property {number|null} closeDelayTimeout - Timeout ID for the delay before the lightbox can be reopened.
 * @property {boolean} canOpenLightbox - Indicates if the lightbox can be opened.
 * @property {number} lightboxReopenDelay - Delay (in milliseconds) before the lightbox can be reopened.
 * @property {boolean} debug - Indicates if debug logging is enabled.
 * @property {Object} original - Stores original console methods.
 */

/**
 * An object containing settings for lightbox functionality and debugging.
 * @type {Settings}
 */
const settings = {
    startX: 0,
    endX: 0,
    isOpen: true,
    openable: true,
    closeDelayTimeout: null,
    canOpenLightbox: true,
    lightboxReopenDelay: 250,
    debug: false,
    original: {}
};

/**
 * Overrides console methods to log messages only if debugging is enabled.
 */
const consoleMethods = ['log', 'error', 'info', 'warn'];

consoleMethods.forEach(method => {
    settings.original[method] = console[method];
    console[method] = function(...args) {
        if (settings.debug) {
            settings.original[method].apply(console, args);
        }
    };
});

/**
 * Loads a gallery of images from a JSON configuration file and populates the carousel.
 *
 * @param {string} configPath - The path to the JSON file containing image data.
 * @returns {Promise<void>} A promise that resolves when the gallery is successfully loaded.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const loadGallery = async (configPath) => {
    try {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const images = await response.json();

        const container = document.querySelector('#gallery ol');
        const template = document.getElementById('gallery-item-template').content;

        images.forEach((image, index) => {
            const item = document.importNode(template, true);
            const img = item.querySelector('img');

            img.src = `img/gallery/${image.src}`;
            img.alt = image.alt;
            img.dataset.caption = image.caption;
            img.parentNode.dataset.index = index;

            img.addEventListener('click', () => {
                img.parentNode.classList.add('active');
                openLightbox(img.src, image.caption, index);
            });

            container.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
};

/**
 * Opens a lightbox with the selected image.
 *
 * @param {string} src - The source URL of the image.
 * @param {string} caption - The caption for the image.
 * @param {number} index - The index of the image in the gallery.
 */
const openLightbox = (src, caption, index) => {
    console.log('openLightbox');

    if (!settings.canOpenLightbox) {
        console.log("Too soon!!");
        return;
    }

    document.querySelectorAll('.lightbox').forEach(lightbox => document.body.removeChild(lightbox));
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const img = document.createElement('img');
    img.src = src;
    img.alt = caption;
    img.dataset.index = index;

    const captionDiv = document.createElement('div');
    captionDiv.className = 'lightbox-caption';
    captionDiv.textContent = caption;

    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.textContent = 'x';

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    lightboxContent.appendChild(img);
    lightboxContent.appendChild(captionDiv);
    lightboxContent.appendChild(closeButton);

    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);

    window.addEventListener('keydown', keyboardControls);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    img.addEventListener('click', show);

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        console.log('click close');
        closeLightbox(lightbox);
    });
};

/**
 * Closes the currently open lightbox and resets the active gallery item.
 *
 * @param {HTMLElement} lightbox - The lightbox element to be closed.
 */
const closeLightbox = (lightbox) => {
    console.log('closeLightbox');

    document.body.removeChild(lightbox);
    document.querySelectorAll('#gallery li.active').forEach(item => item.classList.remove('active'));

    settings.isOpen = false;

    window.removeEventListener('keydown', keyboardControls);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);

    settings.canOpenLightbox = false;
    settings.closeDelayTimeout = setTimeout(() => {
        settings.canOpenLightbox = true;
    }, settings.lightboxReopenDelay);
};

/**
 * Handles keyboard controls for navigating through the lightbox images.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 */
const keyboardControls = (event) => {
    event.preventDefault();

    switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft":
            show(-1);
            break;
        case "ArrowDown":
        case "ArrowRight":
            show(1);
            break;
        case "Escape":
            closeLightbox(document.querySelector('.lightbox'));
            break;
        default:
            return;
    }
};

/**
 * Handles the start of a touch event for swipe navigation.
 *
 * @param {TouchEvent} event - The touch event object.
 */
const handleTouchStart = (event) => {
    console.log(event.target);

    if (event.touches.length > 1) { return; }

    if (event.target.nodeName !== 'IMG') {
        closeLightbox(document.querySelector('.lightbox'));
        settings.isOpen = false;
        return;
    }
    settings.startX = event.touches[0].clientX;
    settings.isOpen = true;
};

/**
 * Handles the movement during a touch event for swipe navigation.
 *
 * @param {TouchEvent} event - The touch event object.
 */
const handleTouchMove = (event) => {
    if (event.touches.length > 1) { return; }
    settings.endX = event.touches[0].clientX;
};

/**
 * Handles the end of a touch event for swipe navigation.
 *
 * @param {TouchEvent} event - The touch event object.
 */
const handleTouchEnd = (event) => {
    if (event.touches.length > 1) { return; }
    if (settings.isOpen === true) {
        show(Math.sign(settings.startX - settings.endX));
    }
    settings.startX = 0;
    settings.endX = 0;
};

/**
 * Resets the active state of gallery items.
 *
 * @param {number} resetToIndex - The index of the gallery item to set as active.
 */
const resetActive = (resetToIndex) => {
    document.querySelectorAll('#gallery li.active').forEach(item => item.classList.remove('active'));
    document.querySelector(`#gallery li[data-index='${resetToIndex}']`).classList.add('active');
};

/**
 * Displays an image in the lightbox.
 *
 * @param {number|Object} showIndex - The index of the image to show. If an event object is passed, it defaults to showing the next image.
 */
const show = (showIndex) => {
    if (showIndex.type) {
        showIndex = 1;
    }
    console.log('show', showIndex);

    const currentIndex = Number(document.querySelector('#gallery li.active').dataset.index);
    let indexToShow = currentIndex + showIndex;

    let maxIndex = document.querySelector('ol li:last-child').dataset.index;
    if (indexToShow > maxIndex) { indexToShow = 0; }
    if (indexToShow < 0) { indexToShow = maxIndex; }

    const setToSrc = document.querySelector(`#gallery li[data-index='${indexToShow}'] img`).src;
    const setToCaption = document.querySelector(`#gallery li[data-index='${indexToShow}'] img`).dataset.caption;

    resetActive(indexToShow);
    openLightbox(setToSrc, setToCaption, indexToShow);
};
