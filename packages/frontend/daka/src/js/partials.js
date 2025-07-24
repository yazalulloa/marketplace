import categoriesPartialUrl from '../pages/categories.html?url'
import productCarouselPartialUrl from '../pages/products-carousel.html?url'
import bannerCarousel2PartialUrl from '../pages/banner-carousel-2.html?url'
import brandsCarouselPartialUrl from '../pages/brands-carousel.html?url'
import infoCarouselPartialUrl from '../pages/info-pictures.html?url'

const partials = {
  categoriesPartialUrl,
  productCarouselPartialUrl,
  bannerCarousel2PartialUrl,
  brandsCarouselPartialUrl,
  infoCarouselPartialUrl,
}

window.partials = partials;

console.log("Partials loaded:", partials);