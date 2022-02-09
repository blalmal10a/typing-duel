<template>
  <q-page class=" q-pa-md">
    <div class="row full-width">
      <strong >
    Welcome,  {{ name }} {{ email }}</strong>
    <q-space />
    <div>
      <q-btn
      style=" position: absolute; bottom:10px; right:10px"
        size="md"
        rounded
        icon="logout"
        @click="logout"
        label="logout"
        color="cyan"
      />
    </div>
    <q-btn style="width: 100px;" color="primary" label="verify" @click="verify" />
    </div>
    <!-- <div class="row full-width">
      <div
        class="col-xs-10 offset-xs-1 col-sm-7 offset-sm-2 col-md-6 offset-md-3"
      >
        <q-card class="my-card q-mt-md" style="width: auto">
          <q-card-section>
            <div class="text-h3 text-center">TO DO LIST</div>
          </q-card-section>

          <q-card-section>
            <div class="row justify-center">
              <div class="col-grow">
                <q-input
                  autofocus
                  outlined
                  v-model="todoTask"
                  type="text"
                  label="enter new task"
                  @keydown.enter="addItem"
                >
                  <template v-slot:after>
                    <q-btn
                      round
                      dense
                      Flat
                      icon="mdi-clipboard-text-outline"
                      @click="addItem"
                      style="color: deepskyblue"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div >
              everything is set! You got nothing to do
            </div>
            <div class="row" v-for="(item, index) in todoLists" :key="index">
              <div
                class="hehe col-grow q-pa-md justify-left"
                @click="
                  triggerPrmpt({
                    index: index,
                    value: item.content,
                    id: item.id,
                  })
                "
                style="cursor: pointer; border: lime double"
              >
                {{ item.content }}
              </div>
              <div class="col-auto q-mx-md q-pt-sm">
                <q-btn
                  round
                  icon="edit"
                  @click="
                    triggerPrmpt({
                      index: index,
                      value: item.content,
                      id: item.id,
                    })
                  "
                />
              </div>

              <div class="col-auto q-pt-sm">
                <q-btn round icon="done" @click="doneItem(item.id)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div> -->

    <!-- <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Update item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            onfocus="this.select()"
            dense
            v-model="item_name"
            autofocus
            @keyup.enter="updateItem(id, item_name)"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="update"
            v-close-popup
            @click="updateItem(id, item_name)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  
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