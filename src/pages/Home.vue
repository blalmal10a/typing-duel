<template>
  <q-page class="flex q-pa-md">
    <strong >
    Welcome,  {{ name }} {{ email }}</strong>
    <q-space />
    <div>
      <q-btn
      style="width: 100px;"
        class="flex flex-center q-px-lg q-py-sm q-mb-md"
        size="md"
        label="Logout"
        @click="logout"
        color="primary"
      />
    <q-btn style="width: 100px;" color="primary" label="verify" @click="verify" />
    </div>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged,sendEmailVerification , signOut } from 'firebase/auth'
import { ref, onMounted } from 'vue'
const auth = getAuth()

export default {
  setup () {
    const name = ref('')
    const email = ref('')
    onMounted(() => {
      onAuthStateChanged((auth), (user) => {
        console.log('hehe')
        if (auth) {
          name.value = user.displayName
          email.value = user.email
          console.log(email.value)

        } else {
          console.log('user name is null')
        }
      })
    })
    return {
      name,email
    }
  },
  created () {

    // onAuthStateChanged((auth), (user) => {
    //   console.log('hehe')
    //   if (auth) {
    //     this.user = user.displayName
    //     this.email = user.email

    //   } else {
    //     console.log('user name is null')
    //   }
    // })
  },
  methods: {
    logout () {
      const auth =getAuth()
      signOut(auth)
      this.$router.push('/')
        .then(() => {
          this.$q.notify({ message: 'Sign Out Success.' })
        })
        .catch(error => console.log('error', error))
    },
    verify() {
      const auth = getAuth()
      sendEmailVerification(auth.currentUser).then(()=>{
        this.$q.notify({message: 'Email verification sent'})
      })
    }
  }
}
</script>