/**
 * @module eventsToggle
 * @description Handles the toggle functionality for showing/hiding past events section.
 * @author Michael Langford
 * @version 1.0.0
 */

/**
 * Toggles the visibility of the past events section and updates button state.
 * 
 * @param {HTMLElement} button - The toggle button element
 * @param {HTMLElement} pastEventsSection - The past events section element
 */
const togglePastEvents = (button, pastEventsSection) => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const toggleText = button.querySelector('.toggle-text');
    
    if (isExpanded) {
        // Hide past events
        pastEventsSection.classList.remove('show');
        pastEventsSection.setAttribute('aria-hidden', 'true');
        button.setAttribute('aria-expanded', 'false');
        toggleText.textContent = 'Show Past Events';
    } else {
        // Show past events
        pastEventsSection.classList.add('show');
        pastEventsSection.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        toggleText.textContent = 'Hide Past Events';
    }
};

/**
 * Initializes the events toggle functionality by setting up event listeners.
 * This function should be called after the DOM is loaded.
 */
export const initEventsToggle = () => {
    const toggleButton = document.getElementById('togglePastEvents');
    const pastEventsSection = document.getElementById('pastEvents');
    
    if (!toggleButton || !pastEventsSection) {
        console.warn('Events toggle elements not found');
        return;
    }
    
    // Add click event listener
    toggleButton.addEventListener('click', () => {
        togglePastEvents(toggleButton, pastEventsSection);
    });
    
    // Add keyboard support for accessibility
    toggleButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            togglePastEvents(toggleButton, pastEventsSection);
        }
    });
};