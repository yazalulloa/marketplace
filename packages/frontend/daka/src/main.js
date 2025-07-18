import 'htmx.org';
import "external-svg-loader";
import PineconeRouter from 'pinecone-router'
// import focus from '@alpinejs/focus'
// import collapse from '@alpinejs/collapse'
// import mask from '@alpinejs/mask'
import AlpineI18n from 'alpinejs-i18n';
import Alpine from 'alpinejs'
import htmx from "htmx.org";

window.htmx = htmx;

// htmx.logAll();
htmx.config.selfRequestsOnly = false;
htmx.config.historyCacheSize = 0;
htmx.config.refreshOnHistoryMiss = true;

import "./js/images.js"

const isDev = import.meta.env.VITE_IS_DEV === 'true'

window.withIsrPrefix = function (path) {
  return "/" + import.meta.env.VITE_ISR_PREFIX + path;
}

document.body.addEventListener('htmx:configRequest', async (evt) => {

  if (isDev) {
    if (evt.detail.path.includes(import.meta.env.VITE_ISR_PREFIX)) {
      evt.detail.path = evt.detail.path.replace(import.meta.env.VITE_ISR_PREFIX,
          "api/isr");
    }
  }

  if (isDev && evt.detail.path.includes("/api/")) {
    // evt.detail.withCredentials = true;

    if (evt.detail.path.startsWith("/api/j")) {
      evt.detail.path = import.meta.env.VITE_JAVA_API_URL + evt.detail.path;
    }

    if (evt.detail.path.startsWith("/api/g")) {
      evt.detail.path = import.meta.env.VITE_GOLANG_API_URL + evt.detail.path;
    }
  }



});

window.Alpine = Alpine
// Alpine.plugin(focus)
// Alpine.plugin(mask)
// Alpine.plugin(collapse)
Alpine.plugin(AlpineI18n)
// Alpine.plugin(PineconeRouter)
Alpine.start()