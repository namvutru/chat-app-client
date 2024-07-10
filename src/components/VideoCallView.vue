<template>
  <div class="video-call">
    Gọi điện
    <v-select
      label="Chọn 1 người bạn"
      v-model="userSelected"
      :items="friends"
      item-title="name"
      variant="outlined"
      @update:model-value="selectUser"
      return-object
    ></v-select>
    <div class="your-content">
      <div class="your-video">
        <video ref="yourvideostream" width="300" height="200" autoplay></video>
      </div>
    </div>
    <div class="friend-contents">
      <div class="friend-video">
        <video ref="friendvideostream" width="300" height="200" autoplay></video>
      </div>
    </div>
    <div class="control-toolbar">
      <v-btn icon="mdi-magnify" @click="changeStatusMicro()">
        <i class="fa fa-microphone" v-if="microstatus" aria-hidden="true"></i>
        <i class="fa fa-microphone-slash" v-if="!microstatus" aria-hidden="true"></i>
      </v-btn>
      <v-btn icon="mdi-magnify" @click="changeStatusCamera()">
        <i class="fa fa-video-camera" v-if="videostatus" aria-hidden="true"></i>
        <div v-if="!videostatus"><img class="img-icon" src="../assets/no-video.png" /></div>
      </v-btn>
      <v-btn icon="mdi-magnify" @click="createCall()"
        ><i class="fa fa-phone" aria-hidden="true"></i
      ></v-btn>
    </div>

    <v-dialog v-model="dialogCall" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" title="Bạn nhận được 1 cuộc gọi">
        <div class="call-content">
          <div class="call-message">Người gọi: {{ userSendCall.name }}</div>
          <div class="call-button">
            <v-btn v-bind="activatorProps" @click="accessCallVideo()" icon="mdi-magnify"
              ><i class="fa fa-phone" aria-hidden="true"></i
            ></v-btn>
          </div>
        </div>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Đóng" @click="dialogCall = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RepositoryFactory from '../apirepository/RepositoryFactory'
// import Peer from 'peerjs'
import { toast } from 'vue3-toastify'
// const peer = new Peer()

const userrepo = RepositoryFactory.get('user')
const user =
  localStorage.getItem('loginInfo') != null
    ? JSON.parse(localStorage.getItem('loginInfo')).user
    : null
const callrepo = RepositoryFactory.get('call')
export default {
  name: 'VideoCallView',
  props: {
    userSendCall: String
  },
  beforeCreate() {},

  created() {
    this.createPeer()

    this.peerConnection.ontrack = (event) => {
      this.remoteStream.addTrack(event.track)
      console.log('linten track', this.remoteStream)
    }
    this.fethFriendOptions()
    if (this.userSendCall) {
      this.dialogCall = true
    }
    this.listenCallUserChannel()
  },
  beforeMount() {
    this.turnOnStream()
  },

  mounted() {
    this.peerConnection.onconnectionstatechange = (event) => {
      if (this.peerConnection.connectionState === 'connected') {
        // this.peerConnection.ontrack = (event) => {
        //   this.remoteStream.addTrack(event.track)
        // }

        console.log('kết nối thàng công', this.peerConnection)
        console.log('remote stream', this.remoteStream)
      }
    }
    this.remoteStream = new MediaStream()
    this.$refs.friendvideostream.srcObject = this.remoteStream
  },
  beforeUnmount() {
    this.turnOffStream()
    this.hangUp()
    this.$emit('close-dialog')
  },
  data() {
    return {
      dialogCall: false,
      microstatus: true,
      videostatus: true,
      yourStream: null,
      userSelectedId: null,
      userSelected: null,
      friends: [],
      peerId: null,
      friendvideostream: null,
      peerConnection: null,
      remoteStream: null
    }
  },

  methods: {
    selectUser(event) {
      console.log(event)
      this.userSelectedId = event.id
    },
    fethFriendOptions() {
      userrepo.friendoptions().then((response) => {
        this.friends = response.data.data
        console.log('friends', response.data.data)
      })
    },
    changeStatusCamera() {
      this.videostatus = !this.videostatus
      this.updateStream()
    },

    changeStatusMicro() {
      this.microstatus = !this.microstatus
      this.updateStream()
    },
    async turnOnStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: this.videostatus,
          audio: this.microstatus
        })
        this.yourStream = stream
        this.$refs.yourvideostream.srcObject = stream
      } catch (e) {
        console.log('e', e)
      }
    },

    pushStream() {
      this.yourStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.yourStream)
        console.log('9981 kiếp nạn', this.yourStream)
      })
    },

    async updateStream() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: this.videostatus,
        audio: this.microstatus
      })
      this.yourStream = stream
      console.log(this.yourStream)
      this.$refs.yourvideostream.srcObject = stream
      // stream.getTracks().forEach((track) => {
      //   this.peerConnection.addTrack(track, stream)
      //   console.log(' update 9981 kiếp nạn', stream)
      // })
    },

    turnOffStream() {
      if (this.yourStream) {
        this.yourStream.getTracks().forEach((track) => {
          track.stop()
        })
        this.yourStream = null
      }
    },
    turnOffMicro() {
      if (this.yourAudioStream) {
        this.yourAudioStream.getTracks()[0].stop()
        this.yourAudioStream = null
      }
    },
    hangUp() {
      this.peerConnection.close()
      this.peerConnection = null
    },
    createPeer() {
      // this.peerId = peer._id
      // peer.on('open', () => {
      //   console.log('peer oke')
      // })
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
    },
    async createCall() {
      this.pushStream()
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          callrepo
            .candidateIce({
              user_receive_id: this.userSelectedId,
              candidate: event.candidate
            })
            .then((response) => {
              console.log('ice candidate', response)
            })
        }
      }

      const offer = await this.peerConnection.createOffer()
      console.log('offer', offer)
      await this.peerConnection.setLocalDescription(offer)
      callrepo
        .callVideo({
          user_receive_id: this.userSelectedId,
          user_send_peer_id: this.peerConnection.localDescription
        })
        .then(async (response) => {
          this.notify(response.data.message)
        })
    },
    async accessCallVideo() {
      this.pushStream()
      this.dialogCall = false
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          callrepo
            .candidateIce({
              user_receive_id: this.userSendCall.id,
              candidate: event.candidate
            })
            .then((response) => {
              console.log('ice candidate', response)
            })
        }
      }
      console.log('user send', this.userSendCall.peerId)
      const offer = this.userSendCall.peerId
      console.log('offer', offer)
      offer.sdp += '\r\n'
      console.log(this.peerConnection)
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

      //answer
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      console.log(answer)
      callrepo
        .accessCallVideo({ user_send_id: this.userSendCall.id, answer: answer })
        .then(async (response) => {
          this.notify(response.data.message)

          // var conn = peer.connect(this.userSendCall.peerId)
          // // on open will be launch when you successfully connect to PeerServer
          // conn.on('open', function () {
          //   // here you have conn.id
          //   conn.send('hi!khó thế')
          //   console.log('đã gửi')
          // })

          // var call = peer.call(this.userSendCall.peerId, this.yourVideoStream)
          // console.log('call', call)
          // call.on('stream', function (remoteStream) {
          //   console.log('remote', remoteStream)
          // })
        })
    },
    listenCallUserChannel() {
      window.Echo.channel('user' + user.id).listen('AccessCallVideoEvent', async (response) => {
        const answer = response.answer
        answer.sdp += '\r\n'
        console.log(answer)
        this.notify(response.message)
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        console.log('thanh cong')
        console.log(this.peerConnection)
        // peer.on('connection', function (conn) {
        //   conn.on('data', function (data) {
        //     console.log('datatest', data)
        //   })
        // })

        // peer.on('call', function (call) {
        //   console.log('rêciveed', call)
        //   call.on('stream', function (remoteStream) {
        //     console.log('rêciveed stream', remoteStream)
        //     this.friendvideostream = remoteStream
        //     this.$refs.friendvideostream.srcObject = remoteStream
        //   })
        // })
      })

      window.Echo.channel('user' + user.id).listen('CandidateEvent', async (response) => {
        const candidate = response.candidate
        console.log(candidate)
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        console.log('ice candidated')
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
.video-call {
  padding: 10px;
  gap: 5px;
  display: flex;
  flex-direction: column;
}

.your-video {
  justify-content: center;
  display: flex;
  border: 1px solid;
  border-radius: 10px;
  border-color: rgb(13, 103, 192);
}
.friend-contents {
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.friend-video {
  border: 1px solid;
  border-radius: 10px;
}
.control-toolbar {
  display: flex;
  justify-content: end;
  gap: 10px;
}

.img-icon {
  width: 15px;
  height: 15px;
}

.call-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.call-message {
  display: flex;
  justify-content: center;
}
.call-button {
  display: flex;
  justify-content: center;
}
</style>

<style>
.v-dialog > .v-overlay__content > .v-card {
  scrollbar-width: none;
}
</style>
