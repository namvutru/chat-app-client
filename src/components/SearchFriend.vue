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
        <i class="fa fa-user-plus" aria-hidden="true" @click="addFriend(item.id)"></i
      ></template>
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
const user = RepositoryFactory.get('user')
const friend = RepositoryFactory.get('friend')

export default {
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

  methods: {
    updateParamName(value) {
      this.params.name = value
      this.searchUser()
    },

    updateParamEmail(value) {
      this.params.email = value
      this.searchUser()
    },

    updateParamPage(page) {
      this.params.page = page
      this.searchUser()
    },
    searchUser() {
      user.search(this.params).then((response) => {
        this.users = response.data.data.data
        this.pages = response.data.data.last_page
      })
    },
    addFriend(id) {
      friend.addfriend({ user_receive_id: id }).then((reponse) => {
        console.log(reponse.data)
        this.notify(reponse.data.message)
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

.table-friend {
  scrollbar-width: none;
}
</style>
