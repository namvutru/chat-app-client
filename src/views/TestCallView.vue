<template>
  <div>
    <h1>WebRTC Video Chat</h1>
    <video ref="localVideo" autoplay muted></video>
    <video ref="remoteVideo" autoplay></video>
    <button @click="call">Call</button>
    <button @click="hangUp">Hang Up</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      signalingServer: null
    }
  },
  async mounted() {
    // Khởi tạo kết nối WebSocket tới signaling server
    this.signalingServer = new WebSocket('ws://localhost:5173')

    this.signalingServer.onmessage = async (message) => {
      const data = JSON.parse(message.data)

      switch (data.type) {
        case 'offer':
          await this.handleOffer(data.offer)
          break
        case 'answer':
          await this.handleAnswer(data.answer)
          break
        case 'candidate':
          await this.handleCandidate(data.candidate)
          break
      }
    }

    // Lấy stream video và audio từ local
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    this.$refs.localVideo.srcObject = this.localStream

    // Khởi tạo remote stream
    this.remoteStream = new MediaStream()
    this.$refs.remoteVideo.srcObject = this.remoteStream

    // Khởi tạo RTCPeerConnection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage({ type: 'candidate', candidate: event.candidate })
      }
    }

    this.peerConnection.ontrack = (event) => {
      this.remoteStream.addTrack(event.track)
    }

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream)
    })
  },
  methods: {
    async call() {
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      this.sendMessage({ type: 'offer', offer: offer })
    },
    async handleOffer(offer) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      this.sendMessage({ type: 'answer', answer: answer })
    },
    async handleAnswer(answer) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    },
    async handleCandidate(candidate) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    },
    hangUp() {
      this.peerConnection.close()
      this.peerConnection = null
    },
    sendMessage(message) {
      this.signalingServer.send(JSON.stringify(message))
    }
  }
}
</script>
