import Repository from './Repository'

export default {
  upload(payload) {
    return Repository.post(`upload`, payload)
  }
}
