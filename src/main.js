import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidate from './includes/validation';
import { auth } from './includes/firebase';
import i18n from './includes/i18n';
import Icon from './directives/icon';
import './assets/tailwind.css';
import './assets/main.css';
import './registerServiceWorker';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(i18n);
    app.use(store);
    app.use(router);
    app.use(VeeValidate);
    app.directive('icon', Icon);

    app.mount('#app');
  }
});
