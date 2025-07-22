import categoriesPartialUrl from '../pages/categories.html?url'
import productCarouselPartialUrl from '../pages/products-carousel.html?url'
import bannerCarouselPartialUrl from '../pages/banner-carousel.html?url'

const partials = {
  categoriesPartialUrl,
  productCarouselPartialUrl,
  bannerCarouselPartialUrl,
}

window.partials = partials;

console.log("Partials loaded:", partials);