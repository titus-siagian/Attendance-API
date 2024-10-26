import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMeta from 'vue-meta';
import vuetify from './plugins/vuetify';
import Toast from 'vue-toastification';

import 'leaflet-geosearch/assets/css/leaflet.css';
import 'leaflet/dist/leaflet.css';
import 'vue-toastification/dist/index.css';
import '@/assets/tailwind.css';

Vue.config.productionTip = false;

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

Vue.use(Toast, {
  timeout: 3000,
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
