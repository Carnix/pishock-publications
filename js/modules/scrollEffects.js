// scrollEffects.js

/**
 * Callback function for Intersection Observer
 * @param {IntersectionObserverEntry[]} entries - The array of IntersectionObserverEntry objects
 * @param {IntersectionObserver} observer - The IntersectionObserver instance
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
 * Initialize Intersection Observer and start observing elements
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