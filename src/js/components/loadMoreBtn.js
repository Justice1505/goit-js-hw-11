export default class LoadMoreBtn {
    constructor({ selector, hidden = false }) {
        this.refs = this.getRefs(selector);

        hidden && this.hide();
    }

    getRefs(selector) {
        const refs = {};
        refs.btn = document.querySelector(selector);
        refs.label = refs.btn.querySelector('.load-more-btn__label');
        refs.spinner = refs.btn.querySelector('.spinner');

        return refs;
    }

    enable() {
        this.refs.btn.disabled = false;
        this.refs.btn.style.cursor = 'pointer';
        this.refs.label.textContent = 'Load more';
        this.refs.spinner.classList.add('is-hidden');
    }

    disable() {
        this.refs.btn.disabled = true;
        this.refs.btn.style.cursor = 'default';
        this.refs.label.textContent = 'Loading';
        this.refs.spinner.classList.remove('is-hidden');
    }

    show() {
        this.refs.btn.classList.remove('is-hidden');
    }

    hide() {
        this.refs.btn.classList.add('is-hidden');
    }
}
