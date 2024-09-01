/**
 * Loads a gallery of images from a JSON configuration file and populates the carousel.
 *
 * @param {string} configPath - The path to the JSON file containing image data.
 * @returns {Promise<void>} A promise that resolves when the gallery is loaded.
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
                openLightbox(img.src, image.caption);
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
 */
const openLightbox = (src, caption) => {
    console.log('openLightbox');

    document.querySelectorAll('.lightbox').forEach(lightbox => document.body.removeChild(lightbox));
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const lightboxContent = `
        <div class="lightbox-content">
            <img src="${src}" alt="${caption}">
            <div class="lightbox-caption">${caption}</div>
            <button class="lightbox-close">&times;</button>
        </div>
    `;

    lightbox.innerHTML = lightboxContent;
    document.body.appendChild(lightbox);

    window.addEventListener("keydown", keyboardControls);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        closeLightbox(lightbox);
    });
};

const closeLightbox = (lightbox) => {

    document.body.removeChild(lightbox);
    document.querySelectorAll('#gallery li.active').forEach(item => item.classList.remove('active'));

    window.removeEventListener("keydown", keyboardControls);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);

};

const keyboardControls = (event) => {
    event.preventDefault();

    switch (event.key) {
        case "ArrowLeft":
            show(-1);
            break;
        case "ArrowRight":
            show(1);
            break;
        case "Escape":
            closeLightbox(document.querySelector('.lightbox'));
        default:
            return;
    }
};

const touchData = {
    startX: 0,
    endX: 0,
}

const handleTouchStart = (event) => {
    touchData.startX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
    touchData.endX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    show(Math.sign(touchData.startX - touchData.endX));
    touchData.startX = 0;
    touchData.endX = 0;
};

const resetActive = (resetToIndex) => {
    document.querySelectorAll('#gallery li.active').forEach(item => item.classList.remove('active'));
    document.querySelector(`#gallery li[data-index='${resetToIndex}']`).classList.add('active');
}

const show = (showIndex) => {
    const currentIndex = Number(document.querySelector('#gallery li.active').dataset.index);
    let indexToShow = currentIndex + showIndex;

    let maxIndex = document.querySelector('ol li:last-child').dataset.index;
    if(indexToShow > maxIndex) { indexToShow = 0; }
    if(indexToShow < 0) { indexToShow = maxIndex; }

    const setToSrc = document.querySelector(`#gallery li[data-index='${indexToShow}'] img`).src;
    const setToCaption = document.querySelector(`#gallery li[data-index='${indexToShow}'] img`).dataset.caption;
    resetActive(indexToShow);
    openLightbox(setToSrc, setToCaption);
}