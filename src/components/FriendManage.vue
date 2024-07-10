<template>
  <div class="search-friend-tab">
    <div class="search-bar">
      <v-text-field
        class="search-param"
        placeholder="Nhập tên"
        @update:modelValue="updateParamName"
        variant="outlined"
        hide-details
      ></v-text-field>

      <!-- <v-text-field
          class="search-param"
          placeholder="Nhập email"
          @update:modelValue="updateParamEmail"
          variant="outlined"
          hide-details
        ></v-text-field> -->
    </div>

    <v-data-table class="table-friend" :items="users" :headers="headers" hide-default-footer>
      <template v-slot:item.action="{ item }">
        <div class="action">
          <div class="icon-action">
            <i class="fa fa-user-times" aria-hidden="true" @click="unFriend(item.id)"></i>
          </div>
          <div class="icon-action">
            <i class="fa fa-paper-plane-o" aria-hidden="true" @click="addGroup(item.id)"></i>
          </div>
        </div>
      </template>
    </v-data-table>
    <div class="text-center">
      <v-pagination v-model="params.page" @update:model-value="updateParamPage" :length="pages">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import RepositoryFactory from '../apirepository/RepositoryFactory'
import { toast } from 'vue3-toastify'
const userrepo = RepositoryFactory.get('user')
const friend = RepositoryFactory.get('friend')
const group = RepositoryFactory.get('group')

export default {
  name: 'FriendManage',
  props: {
    parentRoomSelected: Number
  },
  data() {
    return {
      headers: [
        { title: 'Tên', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Hành động', key: 'action', sortable: false }
      ],
      notifications: [
        { title: 'noti ádas dsadas', type: 'addfriend' },
        { title: 'noti2', type: 'addgroup' }
      ],
      params: { name: '', email: '', page: '1' },
      pages: 0,
      users: []
    }
  },

  created() {
    this.fethFriends()
  },
  methods: {
    updateParamName(value) {
      this.params.name = value
      this.fethFriends()
    },

    updateParamEmail(value) {
      this.params.email = value
      this.fethFriends()
    },

    updateParamPage(page) {
      this.params.page = page
      this.fethFriends()
    },
    fethFriends() {
      userrepo.friends(this.params).then((response) => {
        this.users = response.data.data.data
        this.pages = response.data.data.last_page
      })
    },
    unFriend(id) {
      friend.unfriend(id).then((response) => {
        this.fethFriends()
        this.$emit('unfriend')
        this.notify(response.data.message)
      })
    },
    addGroup(id) {
      group.addgroup({ user_receive_id: id, room_id: this.parentRoomSelected }).then((response) => {
        this.notify(response.data.message)
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
.search-friend-tab {
  padding: 15px;
}

.search-bar {
  display: flex;
}

.search-param {
  margin: 10px;
}

.action {
  display: flex;
}

.icon-action {
  padding: 10px;
}
</style>
<style>
.table-friend .v-table__wrapper {
  scrollbar-width: none;
}
</style>
