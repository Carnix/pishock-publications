export const initYoutubeEmbeds = () => {
    document.querySelectorAll('.youtube-player').forEach(player => {
        const videoId = player.dataset.videoId;
        const wrap = player.querySelector('.youtube-thumbnail-wrap');

        wrap.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
            iframe.title = player.querySelector('.podcast-youtube-label').textContent;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.className = 'youtube-embed-iframe';

            const label = player.querySelector('.podcast-youtube-label');
            if (label) label.hidden = true;

            wrap.replaceWith(iframe);
        });
    });
};
