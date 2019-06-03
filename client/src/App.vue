<template>
  <div id="app">
    <b-nav>
      <b-nav-item>
        <router-link
          class="nav-item active"
          to="/"
        >
          <span class="navbar-brand">
            Home
          </span>
        </router-link>
      </b-nav-item>
      <div v-if="user.username !== ''">
        <b-nav-item>
          <router-link
            class="nav-item active"
            to="/chat"
          >
            <span class="navbar-brand">
              Message Box
            </span>
          </router-link>
          <b-link @click="logOut">
            <span class="navbar-brand">
              Log out
            </span>
          </b-link>
        </b-nav-item>
      </div>
      <div v-else>
        <b-nav-item>
          <b-link @click="changeSignIn">
            <span class="navbar-brand">
              Sign In
            </span>
          </b-link>
          <b-link
            @click="changeSignUp"
          >
            <span class="navbar-brand">
              Sign Up
            </span>
          </b-link>
        </b-nav-item>
      </div>
    </b-nav>
    <div>
      <p
        v-if="user.username !== ''"
        class="authorized-user"
      >
        Current user: <span>{{ user.username }}</span>
      </p>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <SignIn
        :is-open="this.isOpen"
        @closeSignInForm="changeSignIn"
        @openSignUpFrom="changeSignIn"
      />
    </div>
    <div>
      <SignUp
        :is-open-sign-up="this.isOpenSignUp"
        @closeSignUpForm="changeSignUp"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  /* components */
  import SignIn from './components/Auth/SignIn.vue';
  import SignUp from './components/Auth/SignUp.vue';

  export default {
    name: 'App',
    components:{
      SignIn,
      SignUp
    },
    data(){
      return {
        refForm: 'signInForm',
      }
    },
    computed: mapGetters({
      isOpen: 'user/getIsOpen',
      isOpenSignUp: 'user/getIsOpenSignUp',
      user: 'user/getUser'
    }),
    created() {
      this.$store.dispatch('user/checkAuthorization');
    },
    methods:{
      changeSignIn() {
        this.$store.commit('user/SET_CHANGE_IS_OPEN_SIGN_IN', !this.isOpen);
      },
      changeSignUp() {
        this.$store.commit('user/SET_CHANGE_IS_OPEN_SIGN_UP', !this.isOpenSignUp);
      },
      logOut() {
        this.$store.dispatch('user/logOut');

      }
    }
  }
</script>
<style scopped>
  .bt-signin {
    cursor: pointer;
  }
  .authorized-user {
    margin-left: 14px;
    color: #000000;
  }
  .authorized-user span {
    color: #007bff;
  }
</style>
