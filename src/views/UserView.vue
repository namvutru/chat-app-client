<template>
  <v-layout class="rounded rounded-md user-view">
    <v-app-bar color="primary" prominent window>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"
        ><i class="fa fa-bars" aria-hidden="true"></i
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Chat App by Namvutru</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center justify-space-around">
        <v-avatar color="info">
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
        </v-avatar>

        <!-- <v-avatar>
          <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
        </v-avatar> -->
      </div>
      <v-dialog transition="dialog-bottom-transition" width="auto">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn id="callbutton" v-bind="activatorProps" icon="mdi-magnify"
            ><i class="fa fa-phone" aria-hidden="true"></i
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <VideoCallView
              @close-dialog="userSendCall = null"
              ref="videoCallView"
              :userSendCall="userSendCall"
            >
            </VideoCallView>
            <v-card-actions class="justify-end">
              <v-btn text="Đóng" @click="isActive.value = false"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      <template v-if="$vuetify.display.mdAndUp"> </template>
      <v-btn icon="mdi-magnify" variant="text" @click="drawerSearch = !drawerSearch"
        ><i class="fa fa-search" aria-hidden="true"></i
      ></v-btn>

      <v-speed-dial location="bottom center" transition="scale-transition">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon="mdi-magnify" variant="text" v-bind="activatorProps"
            ><i class="fa fa-bell" aria-hidden="true"></i
          ></v-btn>
        </template>
        <div>
          <v-list :items="notifications" class="notification">
            <template v-slot:title="{ item }">
              <div class="notifi-addfriend">
                <div class="notifi-message">{{ item.title }}</div>
                <div
                  v-if="item.type == typenotifications.addfriend"
                  class="friend-access"
                  @click="accessFriend(item.id)"
                >
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div
                  v-if="item.type == typenotifications.addfriend"
                  class="friend-refuse"
                  @click="refuseFriend(item.id)"
                >
                  <i class="fa fa-times-circle-o" aria-hidden="true"></i>
                </div>
                <div
                  v-if="item.type == typenotifications.addgroup"
                  class="friend-access"
                  @click="accessGroup(item.id)"
                >
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div
                  v-if="item.type == typenotifications.addgroup"
                  class="friend-refuse"
                  @click="refuseGroup(item.id)"
                >
                  <i class="fa fa-times-circle-o" aria-hidden="true"></i>
                </div>
              </div>
            </template>
          </v-list>
        </div>
      </v-speed-dial>
      <v-btn icon="mdi-dots-vertical" variant="text" @click="logout"
        ><i class="fa fa-sign-out" aria-hidden="true"></i
      ></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="400">
      <v-list
        class="rooms-list"
        :items="rooms"
        lines="three"
        item-props
        item-value="room_id"
        v-model="roomSelected"
        @click="selectRoom"
      >
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawerSearch" location="right" :width="400">
      <v-card>
        <v-tabs v-model="tab" bg-color="#f2f3f5">
          <v-tab value="one">Bạn bè</v-tab>
          <v-tab value="two">Nhóm</v-tab>
          <v-tab value="three">Mời kết bạn</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one"
            ><FriendManage
              ref="friendManage"
              @unfriend="fetchRooms()"
              :parentRoomSelected="roomSelected"
            ></FriendManage
          ></v-tabs-window-item>

          <v-tabs-window-item value="two"
            ><RoomManage @fetch-rooms="fetchRooms()"></RoomManage>
          </v-tabs-window-item>

          <v-tabs-window-item value="three"><SearchFriend></SearchFriend></v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar color="grey-lighten-2" height="80" location="bottom" flat>
      <v-row>
        <div class="option-bar">
          <span>File Selected: {{ inputfiles.length }}</span>
        </div>

        <div class="input-message">
          <input id="fileUpload" @change="uploadFiles" type="file" multiple hide-input hidden />
          <v-text-field
            placeholder="Nhập tin nhắn"
            v-model="typeText"
            variant="solo-filled"
            hide-details
          >
            <template v-slot:prepend>
              <i
                class="fa fa-paperclip"
                style="color: blue"
                aria-hidden="true"
                @click="chooseFiles"
              ></i>
            </template>
            <template v-slot:append>
              <i
                v-if="typeText"
                class="fa fa-paper-plane"
                style="color: blue"
                aria-hidden="true"
                @click="sendMessage"
              ></i>
            </template>
          </v-text-field>
        </div>
      </v-row>
    </v-app-bar>

    <v-main style="min-height: 300px; width: 100%">
      <v-list class="messages-list" lines="two">
        <v-list-item v-for="(item, index) in messages" :key="index">
          <v-list-item-content
            class="message-content"
            :class="{ yourmessage: item.isyou, noticontent: item.isnotimessage }"
          >
            <v-avatar v-if="!item.isyou && !item.isnotimessage" class="avatar">
              <img :src="item.prependAvatar" alt="Avatar" />
            </v-avatar>

            <div class="text-content">
              <!-- <span class="message-info">{{ item.username }}</span> -->
              <div class="div-content" :class="{ yourmessage: item.isyou }">
                <div :class="{ yourmessage: item.isyou }" class="div-message">
                  <span
                    :class="{ message: !item.isnotimessage, notimessage: item.isnotimessage }"
                    >{{ item.title }}</span
                  >
                </div>

                <div v-if="!item.isnotimessage" :class="{ yourmessage: item.isyou }">
                  <span class="message-info">{{ formatDate(item.created_at) }}</span>
                </div>
                <div class="image-content" :class="{ yourmessage: item.isyou }">
                  <div class="div-image" v-for="file in item.files" :key="file.id">
                    <!-- <v-title>{{ linkfile + file.url }}</v-title> -->
                    <v-img
                      v-if="file.type_file == typefile.image"
                      :lazy-src="`${linkfile + file.url}`"
                      :src="`${linkfile + file.url}`"
                      aspect-ratio="1"
                      class="bg-grey-lighten-2"
                      width="120"
                      cover
                    >
                      <template v-slot:placeholder>
                        <v-row align="center" class="fill-height ma-0" justify="center">
                          <v-progress-circular
                            color="grey-lighten-5"
                            indeterminate
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </div>
                </div>
                <div class="video-content" :class="{ yourmessage: item.isyou }">
                  <div class="div-video" v-for="file in item.files" :key="file.id">
                    <video
                      width="200"
                      v-if="file.type_file == typefile.video"
                      :src="`${linkfile + file.url}`"
                      controls
                    ></video>
                  </div>
                </div>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-main>
  </v-layout>
</template>

<script>
import RepositoryFactory from '../apirepository/RepositoryFactory'
import SearchFriend from '../components/SearchFriend.vue'
import RoomManage from '../components/RoomManage.vue'
import FriendManage from '../components/FriendManage.vue'
import { toast } from 'vue3-toastify'
import VideoCallView from '../components/VideoCallView.vue'

// import Echo from 'laravel-echo'
const room = RepositoryFactory.get('room')
const file = RepositoryFactory.get('file')
const linkfile = RepositoryFactory.get('link_files')
const typefile = RepositoryFactory.get('type_file')
const friend = RepositoryFactory.get('friend')
const group = RepositoryFactory.get('group')
const typenotifications = RepositoryFactory.get('type_notifications')
const user =
  localStorage.getItem('loginInfo') != null
    ? JSON.parse(localStorage.getItem('loginInfo')).user
    : null
const auth = RepositoryFactory.get('auth')
export default {
  data() {
    return {
      drawerSearch: false,
      drawer: true,
      roomSelected: 1,
      rooms: [],
      messages: [],
      typeText: '',
      inputfiles: [],
      linkfile: linkfile,
      typefile: typefile,
      typenotifications: typenotifications,
      tab: null,
      notifications: [],
      activeChannels: [],
      dialogCall: false,
      userSendCall: null,
      user: user
    }
  },

  created() {
    this.fetchRooms()
    this.fetchMessage()
    this.listenChannelRoomSelected()
    this.listenUserChannel()
    this.fetchNotifications()
  },
  beforeUnmount() {
    this.destroyAllChannel()
  },
  components: {
    SearchFriend,
    RoomManage,
    FriendManage,
    VideoCallView
  },

  methods: {
    fetchRooms() {
      room.get().then((response) => {
        const roomreponse = response.data.data
        this.rooms = []
        roomreponse.forEach((room) => {
          this.rooms.push({
            room_id: room.id,
            prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            title: room.name,
            subtitle: room.lastmessage != null ? room.lastmessage.message : '',
            props: {
              appendIcon: 'mdi-close'
            }
          })
        })
      })
    },

    fetchMessage() {
      room.getRoomMessages(this.roomSelected).then((response) => {
        this.messages = []
        const messageReponse = response.data.data
        if (messageReponse) {
          messageReponse.forEach((message) => {
            this.messages.push({
              isnotimessage: message.user_id == null ? true : false,
              isyou: user.id == message.user_id ? true : false,
              prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              title: message.message,
              created_at: message.created_at,
              username: message.user_name,
              files: message.files
            })
          })
        }

        this.$nextTick(() => {
          this.scrollChatToBottom()
        })
      })
    },

    fetchNotifications() {
      this.notifications = []
      this.fetchAddfriend()
      this.fetchAddgroup()
    },

    fetchAddfriend() {
      friend.addfriendslist().then((response) => {
        response.data.data.forEach((item) => {
          this.notifications.push({
            title: 'Lời mời kết bạn từ ' + item.user_send_name,
            id: item.id,
            type: this.typenotifications.addfriend
          })
        })
      })
    },
    fetchAddgroup() {
      group.addgroupslist().then((response) => {
        response.data.data.forEach((item) => {
          this.notifications.push({
            title: 'Lời mời tham gia phòng ' + item.room_name,
            id: item.id,
            type: this.typenotifications.addgroup
          })
        })
      })
    },
    sendMessage() {
      room
        .postRoomMessage(this.roomSelected, { message: this.typeText, files: this.inputfiles })
        .then(() => {
          this.pushMessage({
            user_id: user.id,
            message: this.typeText
          })
          this.fetchMessage()
          this.typeText = ''
          this.inputfiles = []
        })
    },

    pushMessage(message) {
      this.messages.push({
        isyou: user.id == message.user_id ? true : false,
        prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        title: message.message
      })

      this.$nextTick(() => {
        this.scrollChatToBottom()
      })
    },
    selectRoom(event) {
      const listItem = event.target.closest('.v-list-item')
      const roomId = listItem ? listItem.getAttribute('room_id') : null

      this.roomSelected = roomId
      this.fetchMessage()
      this.fetchRooms()
      this.listenChannelRoomSelected()
    },

    scrollChatToBottom() {
      const messageslist = document.querySelector('.messages-list')
      messageslist.scrollTop = messageslist.scrollHeight
    },
    destroyAllChannel() {
      for (let channelName in this.activeChannels) {
        if (this.activeChannels.includes(channelName)) {
          window.Echo.leaveChannel(channelName)
        }
      }
    },
    listenChannelRoomSelected() {
      // if (this.activeChannels.includes('room' + this.roomSelected)) {
      window.Echo.channel('room' + this.roomSelected).listen('GotMessage', (data) => {
        this.fetchMessage()
        this.fetchRooms()
        console.log(data)
      })

      window.Echo.channel('room' + this.roomSelected).listen('AccessGroupEvent', (data) => {
        this.fetchMessage()
        this.fetchRooms()
        console.log(data)
      })

      window.Echo.channel('room' + this.roomSelected).listen('OutGroupEvent', (data) => {
        this.fetchMessage()
        this.fetchRooms()
        console.log(data)
      })
      this.activeChannels.push('room' + this.roomSelected)
      // }
    },

    listenUserChannel() {
      // if (this.activeChannels.includes('user' + user.id)) {
      window.Echo.channel('user' + user.id).listen('AddFriendEvent', (response) => {
        this.notify(response.message)
        this.fetchNotifications()
      })
      window.Echo.channel('user' + user.id).listen('AccessFriendEvent', (response) => {
        this.notify(response.message)
        this.$refs.friendManage.fethFriends()
        this.fetchNotifications()
        this.fetchRooms()
      })

      window.Echo.channel('user' + user.id).listen('AddGroupEvent', (response) => {
        this.notify(response.message)
        this.fetchNotifications()
      })

      window.Echo.channel('user' + user.id).listen('CallVideoEvent', (response) => {
        this.notify(response.message)
        this.fetchNotifications()
        this.userSendCall = {
          id: response.user_send_id,
          name: response.user_send_name,
          peerId: response.user_send_peer_id
        }
        document.getElementById('callbutton').click()
      })
      this.activeChannels.push('user' + user.id)
      // }
    },
    goToLoginView() {
      this.$router.replace({ name: 'login' })
    },
    logout() {
      auth.logout().then((data) => {
        console.log(data)
        this.goToLoginView()
      })
    },
    formatDate(date) {
      return new Date(date).toLocaleTimeString()
    },
    chooseFiles() {
      document.getElementById('fileUpload').click()
    },
    uploadFiles(event) {
      const formData = new FormData()
      for (let i = 0; i < event.target.files.length; i++) {
        formData.append('files[]', event.target.files[i])
      }
      file.upload(formData).then((reponse) => {
        this.inputfiles = this.inputfiles.concat(reponse.data.data)
      })
    },
    accessFriend(id) {
      friend.accessfriend(id).then((response) => {
        this.$refs.friendManage.fethFriends()
        this.notify(response.data.message)
        this.fetchNotifications()
        this.fetchRooms()
      })
    },

    refuseFriend(id) {
      friend.refusefriend(id).then((response) => {
        this.notify(response.data.message)
        this.fetchNotifications()
      })
    },

    accessGroup(id) {
      group.accessgroup(id).then((response) => {
        this.notify(response.data.message)
        this.fetchNotifications()
        this.fetchRooms()
      })
    },

    refuseGroup(id) {
      group.refusegroup(id).then((response) => {
        this.notify(response.data.message)
        this.fetchNotifications()
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
.user-view {
  height: 100%;
}

.option-bar {
  margin-left: 15px;
  width: 32%;
  font-size: 10px;
  align-content: center;
  justify-content: center;
}

.input-message {
  display: flex;
  width: 57%;
  margin-left: 10px;
}

.message {
  word-break: normal;
  padding: 5px;
  font-size: 12px;
  background-color: #f2f3f5;
  border-radius: 10px;
}

.message-info {
  font-size: 10px;
  color: blue;
}

.message-content {
  display: flex;
}

.div-content {
  display: flex;
  flex-direction: column;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.avatar {
  margin-left: 10px;
  margin-right: 10px;
}

.yourmessage {
  justify-content: end;
  display: flex;
}

.messages-list {
  height: 80vh;
  scrollbar-width: none;
}

.v-navigation-drawer__content {
  scrollbar-width: none;
}

/* .files-content {
  
} */

.div-message {
  padding: 5px;
}

.div-image {
  padding: 5px;
}

.image-content {
  display: flex;
  flex-wrap: wrap;
}

.video-content {
  display: flex;
  flex-wrap: wrap;
}

.div-video {
  display: flex;
}

.notification {
  border-radius: 6px;
  background-color: rgb(13, 103, 192);
}

.notifi-addfriend {
  display: flex;
  color: #fff;
}

.friend-access {
  display: flex;
  justify-content: center;
  padding: 4px;
}

.friend-refuse {
  display: flex;
  justify-content: center;
  padding: 4px;
}

.noticontent {
  justify-content: center;
}

.notimessage {
  font-size: 12px;
  color: rgb(13, 103, 192);
}
</style>
