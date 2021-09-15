const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
        this.totalPages = null;
        this.isLastPage = false;
    }

    async fetchImages() {
        const searchParams = new URLSearchParams({
            key: '23262939-6c0fd5a3da3fb9e3fdc7add54',
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safeSearch: true,
            page: this.page,
            per_page: this.perPage,
        });
        const url = `${BASE_URL}?${searchParams}`;

        const response = await fetch(url);
        const data = await response.json();
        this.determineIfThisIsLastPage(data.total);
        this.incrementPage();

        return data;
    }

    incrementPage() {
        this.page += 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    resetPage() {
        this.page = 1;
    }

    defineTotalPages(totalImages) {
        this.totalPages = Math.ceil(totalImages / this.perPage);
    }

    determineIfThisIsLastPage(totalImages) {
        this.defineTotalPages(totalImages);

        if (this.page > this.totalPages) {
            this.isLastPage = true;
            return;
        }

        this.isLastPage = false;
    }
}
