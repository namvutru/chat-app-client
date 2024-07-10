import Repository from './Repository'
const resource = '/addfriend'
export default {
  addfriend(payload) {
    return Repository.post(`${resource}`, payload)
  },
  unfriend(id) {
    return Repository.post(`${resource}/unfriend/${id}`)
  },
  addfriendslist() {
    return Repository.get(`user/addfriends`)
  },

  accessfriend(id) {
    return Repository.put(`${resource}/${id}`)
  },

  refusefriend(id) {
    return Repository.delete(`${resource}/${id}`)
  }
}
