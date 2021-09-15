export default class ScrollToNewImages {
    constructor({ selector, imagesPerPage = 0 }) {
        this.selector = selector;
        this.imagesPerPage = imagesPerPage;
        this.numberItemToScroll = imagesPerPage;
        this.galleryItems = [];
    }

    scroll() {
        this.setGalleryItems(this.selector);
        this.scrollIntoImages();
        this.incrementNumberItemToScroll();
    }

    scrollIntoImages() {
        this.galleryItems[this.numberItemToScroll].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }

    setGalleryItems(selector) {
        this.galleryItems = document.querySelectorAll(selector);
    }

    incrementNumberItemToScroll() {
        this.numberItemToScroll += this.imagesPerPage;
    }

    resetNumberItemToScroll() {
        this.numberItemToScroll = this.imagesPerPage;
    }
}
