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
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, createUserWithEmailAndPassword, inMemoryPersistence } from 'firebase/auth'
import ForgotPassword from "./ForgotPassword.vue";
const auth = getAuth()
// console.log(auth)
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
      console.log('hehe')
      console.log(auth)
      this.$q.notify('not available yet :(')
    },

    signInExistingUser (email, password) {

      console.log(auth)
      setPersistence(auth, browserSessionPersistence, inMemoryPersistence)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log(userCredential)
              this.$q.notify({ message: 'Sign In Success.' })
              this.$router.push('/home')
              localStorage.setItem('firebase:authUser:AIzaSyDWp4tt9FgtwxHQ9Fr7VyH7IRzsG9eLN8k:[DEFAULT]', 'state')
            })

        })
        .catch(error => {
          console.log(error)
          this.$q.notify({
            color: 'red',
            message: error.message
          })

        })

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
