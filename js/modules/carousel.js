/**
 * @typedef {Object} CarouselConfig
 * @property {string} carouselSelector - CSS selector for the carousel container element.
 * @property {string} slideSelector - CSS selector for the individual slide elements within the carousel.
 * @property {boolean} [enableAutoplay=false] - Whether to enable autoplay for the carousel.
 * @property {number|null} [autoplayInterval=2000] - Autoplay interval in milliseconds.
 * @property {boolean} [enablePagination=true] - Whether to enable pagination for the carousel.
 */

/**
 * JavaScript Carousel
 *
 * This function initializes and manages a customizable carousel.
 *
 * @param {CarouselConfig} config - Configuration options for the carousel.
 * @returns {Object} An object containing methods to create and destroy the carousel.
 */
export const JSCarousel = ({
    carouselSelector,
    slideSelector,
    enableAutoplay = false,
    autoplayInterval = 2000,
    enablePagination = true,
}) => {
    /** @type {number} Tracks the current slide index. */
    let currentSlideIndex = 0;

    /** @type {HTMLElement} The main carousel container element. */
    const carousel = document.querySelector(carouselSelector);

    if (!carousel) {
        console.error("Specify a valid selector for the carousel.");
        return null;
    }

    /** @type {NodeListOf<HTMLElement>} All the slide elements within the carousel. */
    const slides = carousel.querySelectorAll(slideSelector);

    if (!slides.length) {
        console.error("Specify a valid selector for slides.");
        return null;
    }

    /** @type {HTMLElement} The container for pagination buttons. */
    let paginationContainer;

    /** @type {number} Timer ID for autoplay. */
    let autoplayTimer;

    /**
     * Creates and appends an HTML element with attributes and children.
     *
     * @param {string} tag - The type of HTML element to create.
     * @param {Object} attributes - A key-value pair of attributes to set on the element.
     * @param {string|Array<HTMLElement|string>} [children] - Content or child elements to append.
     * @returns {HTMLElement} The created HTML element.
     */
    const addElement = (tag, attributes, children) => {
        const element = document.createElement(tag);

        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (children) {
            if (typeof children === "string") {
                element.textContent = children;
            } else {
                children.forEach((child) => {
                    if (typeof child === "string") {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
            }
        }

        return element;
    };

    /**
     * Adjusts the DOM structure to fit the carousel's requirements.
     * Adds necessary wrappers and controls for the carousel.
     */
    const tweakStructure = () => {
        carousel.setAttribute("tabindex", "0");

        const carouselInner = addElement("div", { class: "carousel-inner" });
        carousel.insertBefore(carouselInner, slides[0]);

        slides.forEach((slide) => {
            carouselInner.appendChild(slide);
        });

        if (enablePagination) {
            paginationContainer = addElement("nav", {
                class: "carousel-pagination",
                role: "tablist",
            });
            carousel.appendChild(paginationContainer);
        }

        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
            if (enablePagination) {
                const paginationBtn = addElement(
                    "btn",
                    {
                        class: `carousel-btn carousel-btn--${index + 1}`,
                        role: "tab",
                    },
                    `${index + 1}`
                );

                paginationContainer.appendChild(paginationBtn);

                if (index === 0) {
                    paginationBtn.classList.add("carousel-btn--active");
                    paginationBtn.setAttribute("aria-selected", true);
                }

                paginationBtn.addEventListener("click", () => {
                    handlePaginationBtnClick(index);
                });
            }
        });
    };

    /**
     * Adjusts the positions of slides based on the current slide index.
     */
    const adjustSlidePosition = () => {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - currentSlideIndex)}%)`;
        });
    };

    /**
     * Updates the appearance of pagination buttons to reflect the current slide.
     */
    const updatePaginationBtns = () => {
        const btns = paginationContainer.children;
        const prevActiveBtns = Array.from(btns).filter((btn) =>
            btn.classList.contains("carousel-btn--active")
        );
        const currentActiveBtn = btns[currentSlideIndex];

        prevActiveBtns.forEach((btn) => {
            btn.classList.remove("carousel-btn--active");
            btn.removeAttribute("aria-selected");
        });
        if (currentActiveBtn) {
            currentActiveBtn.classList.add("carousel-btn--active");
            currentActiveBtn.setAttribute("aria-selected", true);
        }
    };

    /**
     * Updates the carousel's state, including slide positions and pagination buttons.
     */
    const updateCarouselState = () => {
        if (enablePagination) {
            updatePaginationBtns();
        }
        adjustSlidePosition();
    };

    /**
     * Moves the carousel to the next or previous slide based on the direction.
     *
     * @param {string} direction - The direction to move the slide ('next' or 'prev').
     */
    const moveSlide = (direction) => {
        const newSlideIndex =
            direction === "next"
                ? (currentSlideIndex + 1) % slides.length
                : (currentSlideIndex - 1 + slides.length) % slides.length;
        currentSlideIndex = newSlideIndex;
        updateCarouselState();
    };

    /**
     * Event handler for pagination button clicks.
     *
     * @param {number} index - The index of the slide to move to.
     */
    const handlePaginationBtnClick = (index) => {
        currentSlideIndex = index;
        updateCarouselState();
    };

    /**
     * Event handler for keyboard navigation.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     */
    const handleKeyboardNav = (event) => {
        if (!carousel.contains(event.target)) return;
        if (event.defaultPrevented) return;

        switch (event.key) {
            case "ArrowLeft":
                moveSlide("prev");
                break;
            case "ArrowRight":
                moveSlide("next");
                break;
            default:
                return;
        }

        event.preventDefault();
    };

    /**
     * Starts the autoplay functionality of the carousel.
     */
    const startAutoplay = () => {
        autoplayTimer = setInterval(() => {
            moveSlide("next");
        }, autoplayInterval);
    };

    /**
     * Stops the autoplay functionality of the carousel.
     */
    const stopAutoplay = () => clearInterval(autoplayTimer);

    /**
     * Event handler for mouse enter events to stop autoplay.
     */
    const handleMouseEnter = () => stopAutoplay();

    /**
     * Event handler for mouse leave events to start autoplay.
     */
    const handleMouseLeave = () => startAutoplay();

    /**
     * Attaches event listeners to the relevant carousel elements.
     */
    const attachEventListeners = () => {
        carousel.addEventListener("keydown", handleKeyboardNav);
        if (enableAutoplay && autoplayInterval !== null) {
            carousel.addEventListener("mouseenter", handleMouseEnter);
            carousel.addEventListener("mouseleave", handleMouseLeave);
        }

        // Swipe controls
        let startX = 0;
        let endX = 0;

        carousel.addEventListener("touchstart", (event) => {
            startX = event.touches[0].clientX;
        });

        carousel.addEventListener("touchmove", (event) => {
            endX = event.touches[0].clientX;
        });

        carousel.addEventListener("touchend", () => {
            if (startX - endX > 50) {
                moveSlide("next");
            } else if (endX - startX > 50) {
                moveSlide("prev");
            }
        });
    };

    /**
     * Initializes the carousel by setting up the structure and event listeners.
     */
    const create = () => {
        tweakStructure();
        attachEventListeners();
        if (enableAutoplay && autoplayInterval !== null) {
            startAutoplay();
        }
    };

    /**
     * Destroys the carousel by removing event listeners and stopping autoplay.
     */
    const destroy = () => {
        if (enablePagination) {
            paginationContainer.innerHTML = "";
        }

        stopAutoplay();
        carousel.removeEventListener("keydown", handleKeyboardNav);
        carousel.innerHTML = ""; // Clear carousel inner content
    };

    return {
        create,
        destroy,
    };
};
