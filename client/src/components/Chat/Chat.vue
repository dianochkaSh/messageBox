<template>
  <div>
    <b-container class="bv-example-row">
      <b-row class="title-row">
        <b-col>Users</b-col>
        <b-col>Messages</b-col>
      </b-row>
      <b-row>
        <b-col class="users-col">
          <b-container>
            <ul
              v-if=" usersChat && usersChat.length > 0"
              class="list-users"
            >
              <li
                :ref="'currentUser' + this.user.user.id"
                :class=" typeSendMessage === 0 ? 'active': '' "
                @click="changeTypeSendMessage(0)"
              >
                All users
              </li>
              <li
                v-for="(item) in usersChat"
                :key="item.id"
                :ref="'user' + item.id"
                :class="typeSendMessage === item.id ? 'active' : ''"
                @click="changeTypeSendMessage(item.id, item.username, item.id )"
              >
                {{ item.username }}
              </li>
            </ul>
          </b-container>
        </b-col>
        <b-col class="chats-col">
          <b-container class="">
            <ul
              v-chat-scroll="{always: false, smooth: true}"
              class="container-messages"
            >
              <li
                v-for="(msg, index) in chatMessage"
                :key="index"
                :class=" msg.user === user.user.username ? 'user-msg ' : 'other-user'"
              >
                <span
                  class="current-user"
                >
                  {{ msg.user }}:
                </span>
                <span> {{ msg.message }}</span>
              </li>
            </ul>
          </b-container>
          <b-container>
            <b-form
              class="form-send-message"
              @submit.prevent="sendMessage"
            >
              <b-form-group>
                <b-form-input
                  id="exampleInput1"
                  v-model="message"
                  type="text"
                  placeholder="Enter message"
                  class="input-message"
                />
                <b-button
                  type="submit"
                  variant="primary"
                  class="bt-submit"
                >
                  Submit
                </b-button>
              </b-form-group>
            </b-form>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueChatScroll from 'vue-chat-scroll';
  Vue.use(VueChatScroll);
  export default {
    name: 'Chat',
    data() {
      return {
        isConnected: false,
        socketMessage: '',
        typeSendMessage: 0,
        chatMessage: this.message
      }
    },
    computed: {
      message: {
        get(state) {
          return this.$store.state.chat.message;
        },
        set(value) {
          this.$store.commit('chat/SET_MESSAGE', value);
        }
      },
      messages: {
        get(state) {
          return this.$store.state.chat.messages;
        },
        set(value) {
          this.$store.commit('chat/SET_ALL_MESSAGES', value);
        }
      },
      user: {
        get() {
          return this.$store.state.user;
        },
      },
      messagesPrivate: {
        get(state) {
          return this.$store.state.chat.messagesPrivate;
        },
        set(value) {
          this.$store.commit('chat/SET_MESSAGES_PRIVATE', value);
        }
      },
      usersChat: {
        set(value) {
          this.$store.commit('user/SET_USERS_CHATS', value);
        },
        get() {
          return this.$store.state.user.usersChat;
        }
      },
    },
    mounted() {
      this.$socket.connect();
      this.$socket.emit('login');
    },
    sockets: {
      connect() {
        this.isConnected = true;
      },
      disconnect() {
        this.isConnected = false;
      },
      messageChannel(data) {
        if (data.message !== undefined) {
          this.messages.push({ message: data.message, user: data.username });
          this.$store.commit('chat/SET_ALL_MESSAGES', this.messages);
          this.$store.commit('chat/SET_MESSAGE', '');
          if ( (this.user.user.username !== data.username) && ( !this.$refs['currentUser' + this.user.user.id ].classList.contains('active') ) ) {
            this.$refs['currentUser' + this.user.user.id ].classList.add('isNotRead');
          } else {
            this.chatMessage = this.messages;
          }
        }
      },
      messagesPrivate(data) {
        let receiveMessage = {
          [data.username + data.userTo]: { message: data.message, user: data.username, userFrom: data.userTo }
        };
        this.messagesPrivate.push(receiveMessage);
        this.$store.commit('chat/SET_MESSAGES_PRIVATE', this.messagesPrivate);
        let username = (this.user.user.username !== data.username ? data.username  : data.userTo);
        if ( this.user.user.username === data.username ) {
          this.getListMessage(username);
        }
        if ((this.user.user.username === data.userTo) && (this.typeSendMessage !== data.userId)) {
          this.$refs['user' + data.userId ][0].classList.add('isNotRead');
        } else if ((this.user.user.username === data.userTo) && (this.typeSendMessage === data.userId)) {
          this.getListMessage(username);
        }
        this.$store.commit('chat/SET_MESSAGE', '');
      },
      allUsersInChat(data) {
        this.$store.commit('user/SET_USERS_CHATS', data.usersChat);
      }
    },
    methods: {
      sendMessage(e) {
        e.preventDefault();
        if (this.message.trim().length > 0) {
          let message = this.message;
            this.$socket.emit('sendMessage', {
              userTo: this.typeSendMessage,
              message: this.message
            });
        }
      },
      changeTypeSendMessage (idUser, username, id) {
        this.typeSendMessage = idUser;
        if (this.typeSendMessage === 0) {
          this.chatMessage = this.messages;
          this.$refs['currentUser' + this.user.user.id ].classList.remove('isNotRead');
        } else {
          this.$refs['user' + id ][0].classList.remove('isNotRead');
          this.getListMessage(username);
        }
      },
      getListMessage (username) {
        let currentListMessages = [];
        this.messagesPrivate.map( (val) => {
          let key = Object.keys(val);
          if (val[key[0]].userFrom !== this.user.user.username ) {
            if (key[0] === this.user.user.username + username) {
              currentListMessages.push(val[this.user.user.username + username]);
            }
          } else {
            if (key[0] === username + this.user.user.username) {
              currentListMessages.push(val[username + this.user.user.username]);
            }
          }
        });
        this.chatMessage = currentListMessages;
      }
    },
  }
</script>
<style scoped>
  .container-messages {
    height: 400px;
    overflow-y: scroll;
    padding-right: 7px;
  }
  .input-message {
    display: inline-block;
    width: 75%;
  }
  .bt-submit {
    margin-top: -6px;
    width: 22%;
  }
  .current-user {
    color: #006fe6;
    margin-right: 10px;
    font-size: 17px;
  }
  .users {
    color: #003166;
  }
  .other-user {
    float: right;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px 5px;
    background-color: #cccc;
    width: 70%;
    margin-top: 10px;
    word-break: break-all;
    margin-bottom: 0px;
    list-style-type: none;
  }
  .user-msg {
    border: 1px solid #b3d7ff;
    border-radius: 3px;
    padding: 5px 5px;
    background-color: #b3d7ff;
    color: #fff;
    width: 70%;
    float: left;
    margin-top: 10px;
    word-break: break-all;
    margin-bottom: 0px;
    list-style-type: none;
  }
  .form-send-message {
    margin-top: 10px;
    width: 100%;
  }
  .active {
    color: #007bff
  }
  .list-users{
    padding: 0;
  }
  .list-users li{
    list-style-type: none;
    cursor: pointer;
  }
  .users-col {
    max-width: 30%;
    border-right: 1px solid #ccc;
    margin-bottom: 54px;
  }
  .title-row {
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
  }
  .isNotRead {
    color: #004a99;
    background: #e6f2ff;
  }
  .isNotRead:after {
    content: "   new message";
    font-size: 9px;
    margin-left: 20px;
  }
</style>
