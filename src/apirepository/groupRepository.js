import Repository from './Repository'

export default {
  addgroup(payload) {
    return Repository.post(`addgroup`, payload)
  },

  addgroupslist() {
    return Repository.get(`user/addgroups`)
  },

  accessgroup(id) {
    return Repository.put(`addgroup/${id}`)
  },

  refusegroup(id) {
    return Repository.delete(`addgroup/${id}`)
  }
}
