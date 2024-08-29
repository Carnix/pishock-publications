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

        const container = document.getElementById('carousel');
        const template = document.getElementById('gallery-slide-template').content;

        images.forEach(image => {
            const item = document.importNode(template, true);
            const img = item.querySelector('img');
            const caption = item.querySelector('.slide-caption');

            img.src = `img/gallery/${image.src}`;
            img.alt = image.alt;
            img.dataset.caption = image.caption;
            img.classList.add('carousel-item');

            img.addEventListener('click', () => {
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

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    });
};
