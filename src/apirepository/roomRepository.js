import Repository from './Repository'

const resource = '/rooms'

export default {
  get() {
    return Repository.get(`${resource}`)
  },
  post(payload) {
    return Repository.post(`${resource}`, payload)
  },
  getRoomMessages(roomId) {
    return Repository.get(`${resource}/${roomId}/messages`)
  },
  postRoomMessage(roomId, payload) {
    return Repository.post(`${resource}/${roomId}/message`, payload)
  },
  putoutRoom(roomId) {
    return Repository.put(`${resource}/${roomId}`)
  }
}
