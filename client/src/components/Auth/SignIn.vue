<template>
  <b-modal
    v-model="isOpen"
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
    <b-form @submit.prevent="validateSignIn">
      <b-form-group
        label="Email:"
      >
        <b-form-input
          v-model="form.username"
          v-validate="'required|email'"
          placeholder="Enter email"
          type="email"
          name="email"
          :class="{'input': true, 'is-danger': errors.has('email') }"
          @change="changeErrorMessage"
        >
        </b-form-input>
        <span class="error-messages">
          {{ errors.first("email") }}
        </span>
      </b-form-group>
      <b-form-group
        label="Password:"
      >
        <b-form-input
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
          @click="resetForm"
        >
          Reset
        </b-button>
      </b-form-group>
      <div
        v-if="errorMessage"
        class="alert alert-danger"
        role="alert"
      >
        {{ errorMessage }}
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'Signin',
    props: {
      isOpen: Boolean
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        dismissSecs: 5,
        dismissCountDown: 0
      }
    },
    computed: mapGetters({
      errorMessage: 'user/getErrorMessage'
    }),
    watch: {
      isOpen: function (newVal, oldVal) {
        this.$data.form.username = '';
        this.$data.form.password = '';
        this.errors.clear();
        this.changeErrorMessage();
      }
    },
    created() {
      this.form.username = '';
      this.form.password = '';
    },
    methods: {
      closeForm() {
        this.$emit('closeFormSignIn', false);
      },
      hideForm() {
        this.$emit('closeSignInForm', false);
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      validateSignIn() {
        this.$validator.validateAll()
          .then((result) => {
            if (result) {
              this.submitSignIn();
            } else {
              e.preventDefault();
            }
          });
      },
      resetForm() {
        this.form.username = '';
        this.form.password = '';
        this.$validator.reset();
      },
      submitSignIn() {
        this.$store.dispatch('user/signIn', this.form);
      },
      changeErrorMessage() {
        if (this.errorMessage !== '') {
          this.$store.commit('user/SET_ERROR_MESSAGE', '');
        }
      }
    }
  }
</script>
<style scoped>
  .error-messages {
    color: #ff0000;
  }
  .btn-secondary:hover,
  .btn-secondary:not(:disabled):not(.disabled):active {
    color: #000;
    background-color: transparent;
    border-color: transparent;
  }
  .btn-secondary:focus {
    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0);
  }
  .btn-secondary:focus {
    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0);
  }
  .btn-secondary:not(:disabled):not(.disabled):active:focus {
    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0);
  }
</style>
