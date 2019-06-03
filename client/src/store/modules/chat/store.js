export const chatModel = {
  namespaced: true,
  state: {
    messages: [],
    message: '',
    messagesPrivate: []
  },
  getters: {
    getMessages: state => state.messages,
    getMessage: state => state.message,
    getMessagesPrivate: state => state.messagesPrivate,
  },
  mutations: {
    SET_ALL_MESSAGES(state, messages) {
      state.messages = messages;
    },
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_MESSAGES_PRIVATE(state, mess) {
      state.messagesPrivate = mess;
    }
  }
};
