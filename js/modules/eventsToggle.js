/**
 * @module eventsToggle
 * @description Handles toggle functionality for collapsible sections.
 */

const initToggle = (buttonId, sectionId, showText, hideText) => {
    const button = document.getElementById(buttonId);
    const section = document.getElementById(sectionId);

    if (!button || !section) return;

    const toggle = () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const toggleText = button.querySelector('.toggle-text');

        section.classList.toggle('show', !isExpanded);
        section.setAttribute('aria-hidden', String(isExpanded));
        button.setAttribute('aria-expanded', String(!isExpanded));
        toggleText.textContent = isExpanded ? showText : hideText;
    };

    button.addEventListener('click', toggle);
    button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
        }
    });
};

export const initEventsToggle = () => {
    initToggle('toggleMorePodcasts', 'morePodcasts', 'Show More Episodes', 'Hide Additional Episodes');
    initToggle('togglePastEvents', 'pastEvents', 'Show Past Events', 'Hide Past Events');
};
