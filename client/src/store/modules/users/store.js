import axios from 'axios';
import * as config  from '../../../config/config';
import router from '../../../routes';
import Vue from 'vue';

export const userModel = {
  namespaced: true,
  state: {
    isOpen: false,
    isOpenSignUp: false,
    user:{
      username: '',
      email: '',
      id: ''
    },
    errorMassage: '',
    usersChat: []
  },
  getters: {
    getUser: state => state.user,
    getErrorMessage: state => state.errorMassage,
    getIsOpen: state => state.isOpen,
    getIsOpenSignUp: state => state.isOpenSignUp,
    getUsersChat: state => state.usersChat
  },
  mutations: {
    SET_USER(state, objUser) {
      state.user = Object.assign({}, state, objUser );
    },
    SET_ERROR_MESSAGE(state, error) {
      state.errorMassage = error;
    },
    SET_CHANGE_IS_OPEN_SIGN_IN(state, isOpen) {
      state.isOpen = isOpen;
    },
    SET_CHANGE_IS_OPEN_SIGN_UP(state, isOpenSignUp) {
      state.isOpenSignUp = isOpenSignUp;
    },
    SET_USERS_CHATS (state, user) {
      state.usersChat = user;
    }

  },
  actions: {
    /**
     * sign up user
     * @param dispatch
     * @param commit
     * @param objUser - object with user params
     */
    signUp({ dispatch, commit }, objUser) {
      const urlAddress = config.urlAddress;
      axios.post(`${urlAddress}registration`,objUser,{
        headers: {
          "Access-Control-Allow-Credentials" : "true",
          "Access-Control-Allow-Origin" : '*',
          "Content-Type" : "application/json",
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        },
      })
        .then((response) => {
          let data = response.data;
          if (data.ok === 1) {
            console.log('data', data);
            let user = { username: '', email: '', id: ''};
            user.username = data.user;
            user.email = data.email;
            user.id = data.id;
            commit('SET_USER', user);
            commit('SET_CHANGE_IS_OPEN_SIGN_UP', false);
            commit('SET_USERS_CHATS', response.data.usersAll);
            router.push({ 'path': '/chat' });
          } else if (response.data.error) {
            commit('SET_ERROR_MESSAGE', response.data.error);
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    },

    /**
     * sign in user
     * @param dispatch
     * @param commit
     * @param objUser - object with data of user
     */
    signIn({ dispatch, commit }, objUser) {
      commit('SET_ERROR_MESSAGE','');
      const url = config.urlAddress;
      let vm = this;
      axios.post(`${url}enter`,objUser)
        .then((response) => {
          if (response.data.ok === 1) {
            let user = { username: '', email: '', id: ''};
            user.username = response.data.username;
            user.email = response.data.email;
            user.id = response.data.id;
            commit('SET_USER', user);
            commit('SET_USERS_CHATS', response.data.usersAll);
            router.push({ 'path': '/chat' });
            commit('SET_CHANGE_IS_OPEN_SIGN_IN', false);
            router.push({ 'path': '/chat' });
          } else if (response.data.error) {
            commit('SET_ERROR_MESSAGE', response.data.error );
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    },
    /**
     * log out user
     * @param state - state
     * @param dispatch
     */
    logOut({ state, dispatch, commit }) {
      const url = config.urlAddress;
      axios.get(`${url}logout`)
        .then((response) => {
          if (response.data.ok === 1) {
            let user = { username: '', email: '', id: '' };
            commit('SET_USER', user);
            commit('chat/SET_ALL_MESSAGES', [], { root: true });
            commit('chat/SET_MESSAGES_PRIVATE', [], { root: true });
            Vue.prototype.$socket.emit('logout');
            router.push({ 'path': '/' });
          }
        })
        .catch((error) => {
          router.push({ 'path': '/' });
        })
    },

    /**
     * check user authorization
     * @param dispatch
     * @param commit
     */
    checkAuthorization({ dispatch, commit }) {
      const url = config.urlAddress;
      axios.get(`${url}checkEnterUser`)
        .then((response) => {
          if (response.data.ok === 1) {
            let user = { username: '', email: '', id: '' };
            user.username = response.data.user.username;
            user.email = response.data.user.email;
            user.id = response.data.user._id;
            commit('SET_USER', user);
          } else {
            router.push({ 'path': '/' });
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
  }
};
