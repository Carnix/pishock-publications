import { initScrollEffects } from './modules/scrollEffects.js';
import { loadGallery } from './modules/gallery.js';
//import { JSCarousel } from './modules/carousel.js';


await loadGallery('img/gallery/config.json');
initScrollEffects();

//const carousel = JSCarousel({
//    carouselSelector: "#carousel",
//    slideSelector: ".slide",
//});

//carousel.create();
