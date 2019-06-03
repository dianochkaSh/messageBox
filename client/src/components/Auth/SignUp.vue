<template>
  <b-modal
    v-model="isOpenSignUp"
    hide-header
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
  >
    <b-btn
      class="close"
      @click="hideForm"
    >
      x
    </b-btn>
    <b-form @submit.prevent="validateSignUp">
      <b-form-group
        label="Username:"
      >
        <b-form-input
          v-model="form.username"
          v-validate="'required'"
          type="text"
          name="username"
          placeholder="Enter username"
          :class="{'input': true, 'is-danger': errors.has('username') }"
          @change="changeErrorMessage"
        >
        </b-form-input>
        <span class="error-messages">
          {{ errors.first('username') }}
        </span>
      </b-form-group>
      <b-form-group
        label="Email:"
      >
        <b-form-input
          v-model="form.email"
          v-validate="'required|email'"
          type="email"
          name="email"
          placeholder="Enter email"
          :class="{'input': true, 'is-danger': errors.has('email') }"
          @change="changeErrorMessage"
        >
        </b-form-input>
        <span class="error-messages">
          {{ errors.first('email') }}
        </span>
      </b-form-group>

      <b-form-group
        label="Password:"
      >
        <b-form-input
          ref="password"
          v-model="form.password"
          v-validate="'required|min:6'"
          type="password"
          name="password"
          placeholder="Enter password"
          :class="{'is-danger': errors.has('password')}"
          @change="changeErrorMessage"
        >
        </b-form-input>
        <span class="error-messages">
          {{ errors.first('password') }}
        </span>
      </b-form-group>
      <b-form-group
        label="Confirm password:"
      >
        <b-form-input
          v-model="form.confirmPassword"
          v-validate="'required|confirmed:password'"
          type="password"
          name="confirmPassword"
          placeholder="Enter confirm password"
          data-vv-as="password"
          :class="{'is-danger': errors.has('confirmPassword')}"
          @change="changeErrorMessage"
        >
        </b-form-input>
        <span class="error-messages">
          {{ errors.first("confirmPassword") }}
        </span>
      </b-form-group>
      <b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >
          Submit
        </b-button>
        <b-button
          type="reset"
          variant="danger"
          @click="resetFormSignUp"
        >
          Reset
        </b-button>
      </b-form-group>
    </b-form>
    <div
      v-if="errorMessage"
      class="alert alert-danger"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </b-modal>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'Signup',
    props: {
      isOpenSignUp: Boolean
    },
    data() {
      return {
        form: {
          email: '',
          password: '',
          username: '',
          confirmPassword: ''
        }
      }
    },
    computed: mapGetters({
      errorMessage: 'user/getErrorMessage'
    }),
    watch: {
      isOpenSignUp: function (newVal, oldVal) {
        this.$data.form.username = '';
        this.$data.form.password = '';
        this.$data.form.email = '';
        this.$data.form.confirmPassword = '';
        this.errors.clear();
        this.changeErrorMessage();
      }
    },
    methods: {
      hideForm() {
        this.$emit('closeSignUpForm', false);
      },
      validateSignUp(e) {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              this.submitSignUP();
            } else {
              e.preventDefault();
            }
          });
      },
      submitSignUP() {
          this.$store.dispatch('user/signUp', this.form);
      },
      changeErrorMessage() {
        if(this.errorMessage !== ''){
          this.$store.commit('user/SET_ERROR_MESSAGE', '');
        }
      },
      resetFormSignUp() {
        this.form.username = '';
        this.form.password = '';
        this.form.email = '';
        this.form.confirmPassword = '';
        this.$validator.reset();
      },
    }

  }
</script>
<style scoped>
  .btn-secondary:hover,
  .btn-secondary:not(:disabled):not(.disabled):active {
    color: #000;
    background-color: transparent;
    border-color: transparent;
  }
  .btn-secondary:focus {
    box-shadow: 0 0 0 0.2rem rgba(108,117,125,0);
  }
  .btn-secondary:not(:disabled):not(.disabled):active:focus {
    box-shadow: 0 0 0 0.2rem rgba(108,117,125,0);
  }
  .error-messages {
    color: #ff0000;
  }
</style>
