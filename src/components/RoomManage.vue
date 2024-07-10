<template>
  <div class="room-manage">
    <div class="create-group">
      <v-text-field v-model="name" label="Nhập tên nhóm" variant="outlined" hide-details>
        <template v-slot:append>
          <div>
            <i v-if="name" @click="createRoom" class="fa fa-plus-square" aria-hidden="true"></i>
          </div>
        </template>
      </v-text-field>
    </div>
    <div class="list-group">
      <v-data-table class="table-group" :items="groups" :headers="headers" hide-default-footer>
        <template v-slot:item.action="{ item }">
          <i class="fa fa-sign-out" aria-hidden="true" @click="outRoom(item.id)"></i
        ></template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import RepositoryFactory from '../apirepository/RepositoryFactory'
import { toast } from 'vue3-toastify'
const room = RepositoryFactory.get('room')
const user = RepositoryFactory.get('user')

export default {
  data() {
    return {
      name: '',
      groups: []
    }
  },

  created() {
    this.headers = [
      { title: 'Tên Nhóm', key: 'name' },
      { title: 'Hành động', key: 'action', sortable: false }
    ]
    this.fethGroups()
  },

  methods: {
    fethGroups() {
      user.groups().then((response) => {
        this.groups = response.data.data.data
      })
    },
    createRoom() {
      room.post({ name: this.name }).then((response) => {
        this.fethGroups()
        this.notify(response.data.message)
        this.$emit('fetch-rooms')
      })
    },

    outRoom(id) {
      room.putoutRoom(id).then((response) => {
        this.fethGroups()
        this.notify(response.data.message)
        this.$emit('fetch-rooms')
      })
    },

    notify(message) {
      toast(message, {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }
}
</script>

<style scoped>
.room-manage {
  display: flex;
  padding: 15px;
  flex-direction: column;
}
</style>
