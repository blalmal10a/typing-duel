<template>
  <q-page>
    <!-- <to-do /> -->
    <add-item  style="" />
  </q-page>
</template>


<script>
import toDo from '../components/todo.vue'
import addItem from '../components/upload.vue'
export default {
  components: {
    // toDo,
    addItem,
  },
  setup() {
    return {

    }
  },
}
</script>
