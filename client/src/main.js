import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueRouter from 'vue-router';
import router from './routes';
import store from './store/index';
import VeeValidate from 'vee-validate';
import VueCookies from 'vue-cookies';
import * as config from './config/config';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VeeValidate);
Vue.use(VueCookies);

import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: io(config.urlAddress)
}));

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
