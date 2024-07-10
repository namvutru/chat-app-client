import Repository from './Repository'

export default {
  login(payload) {
    return Repository.post(`login`, payload)
  },
  register(payload) {
    return Repository.post(`register`, payload)
  },
  logout() {
    return Repository.post(`logout`)
  }
}
