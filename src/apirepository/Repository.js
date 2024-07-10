import axios from 'axios'

const baseDomain = 'http://127.0.0.1:8000'
const baseURL = `${baseDomain}/api`
var JWTtoken = ''
if (localStorage.getItem('loginInfo') !== null)
  JWTtoken = JSON.parse(localStorage.getItem('loginInfo')).token
export default axios.create({
  baseURL,
  headers: { Authorization: JWTtoken },

  'Content-Type': 'application/json'
})

// 'Content-Type': 'multipart/form-data'
