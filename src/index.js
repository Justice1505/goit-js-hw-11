import 'material-icons';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';
import ImagesApiService from './js/Api';
import LoadMoreBtn from './js/loadMoreBtn';
import galleryItemsMrk from './js/gallery-item.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import clearMrkInside from './js/clearMarkUp';
import ScrollToNewImages from './js/scrollToNewImages';
import ScrollToTopBtn from './js/scrollBtn';
import throttle from 'lodash.throttle';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
  scrollToTopBtn: document.querySelector('.scrollToTopBtn'),
};

const imageApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.js-load-more-btn',
  hidden: true,
});
const scrollToTopBtn = new ScrollToTopBtn('.scrollToTopBtn');
const lightbox = new SimpleLightbox('.js-gallery a');
const scrollToNewImages = new ScrollToNewImages({
  selector: '.js-gallery .gallery__item',
  imagesPerPage: imageApiService.perPage,
});

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.refs.btn.addEventListener('click', onLoadMoreBtnClick);
document.addEventListener('scroll', throttle(scrollToTopBtn.onScroll.bind(scrollToTopBtn), 250));
refs.scrollToTopBtn.addEventListener('click', scrollToTopBtn.onScrollToTopBtnClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.query.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.failure('Enter something for query');
    return;
  }

  imageApiService.query = searchQuery;
  imageApiService.resetPage();
  loadMoreBtn.hide();
  clearMrkInside(refs.gallery);
  scrollToNewImages.resetNumberItemToScroll();

  try {
    const { hits, totalHits } = await imageApiService.fetchImages();

    if (imageApiService.isLastPage) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    updateUIAndRefreshLightbox(hits);
    loadMoreBtn.show();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    errorNotify(error.message);
  }
}

async function onLoadMoreBtnClick() {
  loadMoreBtn.disable();

  try {
    const { hits } = await imageApiService.fetchImages();

    if (imageApiService.isLastPage) {
      Notiflix.Notify.info(`We're sorry, there are no more posts to load`);
      loadMoreBtn.hide();
      loadMoreBtn.enable();
      return;
    }

    updateUIAndRefreshLightbox(hits);
    loadMoreBtn.enable();
    scrollToNewImages.scroll();
  } catch (error) {
    errorNotify(error.message);
  }
}

function appendPhotoCardsMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMrk(data));
}

function updateUIAndRefreshLightbox(data) {
  appendPhotoCardsMarkup(data);
  lightbox.refresh();
}

function errorNotify(message) {
  Notiflix.Notify.warning(`Something went wrong (${message}) please try again later`);
}
