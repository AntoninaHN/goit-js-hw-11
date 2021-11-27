import './sass/main.scss';
import { getImages, resetPage } from './api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import renderGallery from './render-gallery';

function hideBtn(item) {
  item.classList.add('visually-hidden');
}

function showBtn(item) {
  item.classList.remove('visually-hidden');
}

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-btn'),
};

let element = '';
hideBtn(refs.loadBtn);

refs.form.addEventListener('submit', onSearch);
refs.loadBtn.addEventListener('click', onLoad);

function onSearch(event) {
  event.preventDefault();
  element = event.currentTarget.searchQuery.value;
  resetPage();
  hideBtn(refs.loadBtn);
  getImages(element).then(images => {
    const imagesArr = images.data.hits;
    const totalImages = images.data.totalHits;

    if (imagesArr.length === 0) {
      clearGallery();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again 😱',
      );
    }
    if (imagesArr.length < 40) {
      clearGallery();
      //renderGallery(imagesArr);
      refs.gallery.insertAdjacentHTML('beforeend', renderGallery(imagesArr));
      new SimpleLightbox('.gallery a', {
        showCounter: false,
        animationSpeed: 500,
        navText: ['←', '→'],
      });
      Notiflix.Notify.success(`Hooray🎉 We found ${totalImages} images.`);
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      hideBtn(refs.loadBtn);
      return;
    }
    clearGallery();
    //renderGallery(imagesArr);
    refs.gallery.insertAdjacentHTML('beforeend', renderGallery(imagesArr));
    new SimpleLightbox('.gallery a', {
      showCounter: false,
      animationSpeed: 500,
      navText: ['←', '→'],
    });
    Notiflix.Notify.success(`Hooray🎉 We found ${totalImages} images.`);
    showBtn(refs.loadBtn);
  });
}

function onLoad() {
  getImages(element)
    .then(images => {
      const imagesArr = images.data.hits;

      if (imagesArr.length === 0) {
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
        hideBtn(refs.loadBtn);
        return;
      }

      //renderGallery(imagesArr);
      refs.gallery.insertAdjacentHTML('beforeend', renderGallery(imagesArr));
      new SimpleLightbox('.gallery a', {
        showCounter: false,
        animationSpeed: 500,
        navText: ['←', '→'],
      });
      // window.scrollTo({
      //   top: 0,
      //   left: 100,
      //   behavior: 'smooth',
      // });
      // window.scrollTo(0, 500);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })

    .catch(error => {
      console.log(error);
      hideBtn(refs.loadBtn);
    });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// function renderGallery(images) {
//   const markup = images
//     .map(image => {
//       return `
//           <a class="gallery-link" href="${image.largeImageURL}">
//         <div class="photo-card">
//         <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//         <div class="info">
//         <p class="info-item">
//         <b>Likes</b>
//         ${image.likes}
//         </p>
//         <p class="info-item">
//         <b>Views</b>
//         ${image.views}
//         </p>
//         <p class="info-item">
//         <b>Comments</b>
//         ${image.comments}
//         </p>
//         <p class="info-item">
//         <b>Downloads</b>
//         ${image.downloads}
//         </p>
//         </div>
//         </div>
//           </a>`;
//     })
//     .join(' ');

//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    goTopBtn.classList.add('back_to_top-show');
  }
  if (scrolled < coords) {
    goTopBtn.classList.remove('back_to_top-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}

const goTopBtn = document.querySelector('.back_to_top');

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);
