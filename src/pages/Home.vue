<template>
  <q-page class="q-pt-md">
    <div class="row full-width">
      <strong class="q-pl-md">Welcome, {{ name }} {{ email }}</strong>
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
    <div class="row full-width">
      <div class="col-xs-12  col-sm-7 offset-sm-2 col-md-6 offset-md-3">
        <q-card class="q-mx-xs my-card q-pt-md q-mt-md" style="">
          <q-card-section>
            <div class="text-h3  text-center" style="font-size: 4vw">TO DO LIST</div>
          </q-card-section>

            <div class="q-px-sm q-mb-md row justify-center">
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

            <div class="full-width" style="font-size: 3vw" v-if="!todoLists.length " >Everything is set! You got nothing to do</div>
            <div class="row q-mx-xs q-mt-sm" v-for="(item, index) in todoLists" :key="index">
              <div
                class="col-grow q-pa-sm justify-left"
                @click="
                  triggerPrmpt({
                    index: index,
                    value: item,
                  })
                "
                style="font-size:15px; cursor: pointer; border: double deepskyblue"
              >{{ item }}</div>
              <div class="col-auto q-mx-md q-pt-sm">
                <q-btn
                dense
                color="indigo"
                  round
                  icon="edit"
                  @click="
                    triggerPrmpt({
                      index: index,
                      value: item,
                    })
                  "
                />
              </div>

              <div class="col-auto q-mt-sm" >
                <q-btn  dense  color="green" round icon="done" @click="doneItem(index)" />
              </div>
            </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="prompt">
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
            @keyup.enter="updateItem()"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="update" v-close-popup @click="updateItem(id, item_name)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth'
import { ref, onMounted } from 'vue'
const auth = getAuth()

export default {
  setup () {
    const name = ref('')
    const email = ref('')
    const todoTask = ref('')
    const todoLists = ref([])
    const item_name = ref('')
    const itemIndex = ref('')
    const prompt = ref(false)
    function addItem () {
      console.log(todoLists.value)
      todoLists.value.push(todoTask.value)
      todoTask.value = null
      const todoData = JSON.stringify(todoLists.value)
      localStorage.setItem('list', todoData)
    }
    function doneItem(index) {
      todoLists.value.splice(index, 1)
      const todoData = JSON.stringify(todoLists.value)
      localStorage.setItem('list', todoData)
    }
    function triggerPrmpt( item) {
      console.log(item)
      prompt.value = true
      itemIndex.value = item.index
      item_name.value = item.value
    }
    function updateItem( ) {
      todoLists.value[itemIndex.value] = item_name.value
      const  storedata = JSON.stringify( todoLists.value)
      localStorage.setItem('list', storedata)
    }
    onMounted(() => {
      const retrieve = localStorage.getItem('list')
      const list = JSON.parse(retrieve)
      if(list){
      todoLists.value =  list
      }
      onAuthStateChanged((auth), (user) => {
        if (auth) {
          name.value = user.displayName
          email.value = user.email

        } else {
          console.log('user name is null')
        }
      })
      console.log(todoLists.value.length)
    })
    return {
      name, email, addItem, todoLists, todoTask,
      doneItem,
      item_name,
      itemIndex,
      triggerPrmpt,
      prompt,
      updateItem,
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
      const auth = getAuth()
      signOut(auth)
      this.$router.push('/')
        .then(() => {
          this.$q.notify({ message: 'BYEEE' })
        })
        .catch(error => console.log('error', error))
    },
    verify () {
      const auth = getAuth()
      sendEmailVerification(auth.currentUser).then(() => {
        this.$q.notify({ message: 'Email verification sent' })
      })
    }
  }
}
</script>