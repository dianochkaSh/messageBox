import Vue from 'vue';
import Vuex from 'vuex';

/* store */
import { userModel } from './modules/users/store';
import { chatModel } from './modules/chat/store';

Vue.use(Vuex);
export  default new Vuex.Store({
  modules: {
    user: userModel,
    chat: chatModel
  }
});
