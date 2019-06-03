import Vue from 'vue';
import VueRouter from  'vue-router';

/* components */
import Home from './components/Home.vue';
import Chat from './components/Chat/Chat.vue';

Vue.use(VueRouter);
export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/chat',
      component: Chat,
    },
  ],
});
