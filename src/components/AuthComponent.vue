<template>
  <div>
    <template v-if="tab === 'register'">
      <div class="text-center q-mb-lg">Sign up with</div>
    </template>
    <template v-else>
      <div class="text-center q-mb-lg">Sign in with</div>
    </template>
    <div class="flex flex-center">
      <q-btn
        class="flex flex-center q-px-lg q-py-sm q-mb-md"
        color="primary"
        size="md"
        label="Google"
        @click="google"
      />
    </div>
    <template v-if="tab === 'register'">
      <p class="text-center">Sign up with credentials</p>
    </template>
    <template v-else>
      <p class="text-center">Sign in with credentials</p>
    </template>

    <q-form @submit="submitForm">
      <q-input outlined class="q-mb-md" type="email" label="Email" v-model="formData.email" />
      <q-input
        outlined
        class="q-mb-md"
        type="password"
        label="Password"
        v-model="formData.password"
      />
      <div class="row">
        <q-space />
        <q-btn type="submit" color="primary" :label="tab" />
      </div>
    </q-form>
    <div class="text-center q-my-md">
      <q-btn
        flat
        label="Forgot Password?"
        color="green"
        class="text-capitalize rounded-borders"
        v-if="tab !== 'register'"
        @click="forgotPassword"
      />
    </div>
    <q-dialog v-model="resetPwdDialog">
      <ForgotPassword />
    </q-dialog>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword , createUserWithEmailAndPassword } from 'firebase/auth'
import ForgotPassword from "./ForgotPassword.vue";
const auth = getAuth()
export default {
  name: "AuthComponent",
  props: ['tab'],
  components: { ForgotPassword },
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      resetPwdDialog: false
    }
  },
  methods: {
    submitForm () {
      if (this.tab === 'login') {
        this.signInExistingUser(this.formData.email, this.formData.password)
      } else {
        this.createUser(this.formData.email, this.formData.password)
      }
    },
    google () {
      this.$q.notify('not available yet :(')
    },
    signInExistingUser (email, password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          this.$q.notify({ message: 'Sign In Success.' })
          this.$router.push('/home')
        })
        .catch(error => { console.log(error) })
    },
    createUser (email, password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(auth => {
          this.$q.notify({ message: 'Sign In Success.' })
          this.$router.push('/home')
        })
        .catch(error => {
          this.$q.notify(error.response.message)
          console.log(error.response.message)
        })
    },
    forgotPassword () {
      this.resetPwdDialog = true
    },
  }
}
</script>