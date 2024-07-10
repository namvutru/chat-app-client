import Repository from './Repository'

const resource = '/users'

export default {
  search(payload) {
    return Repository.get(`${resource}/search`, { params: payload })
  },

  friends(payload) {
    return Repository.get(`user/friends`, { params: payload })
  },

  friendoptions() {
    return Repository.get(`user/friend-options`)
  },
  groups(payload) {
    return Repository.get(`user/groups`, { params: payload })
  }
}
