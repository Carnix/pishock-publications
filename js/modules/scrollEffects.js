/**
 * Handles intersection events for observed elements. Adds the 'visible' class to elements when they intersect,
 * and stops observing them after they become visible.
 *
 * @param {IntersectionObserverEntry[]} entries - An array of IntersectionObserverEntry objects representing observed elements and their intersection status.
 * @param {IntersectionObserver} observer - The IntersectionObserver instance responsible for observing the elements.
 */
const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

/**
 * Initializes the Intersection Observer for scroll effects and begins observing all section elements in the document.
 * The observed sections will have the 'visible' class added once they enter the viewport, triggering any associated animations.
 */
export const initScrollEffects = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
};
