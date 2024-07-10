import Repository from './Repository'
const resource = '/calls'
export default {
  callVideo(payload) {
    return Repository.post(`${resource}/call-video`, payload)
  },
  accessCallVideo(payload) {
    return Repository.post(`${resource}/access-call-video`, payload)
  },
  candidateIce(payload) {
    return Repository.post(`${resource}/candidate`, payload)
  }
}
