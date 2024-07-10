import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import Echo from 'laravel-echo'
import Vue3Toasity from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

var JWTtoken = ''
if (localStorage.getItem('loginInfo') !== null)
  JWTtoken = JSON.parse(localStorage.getItem('loginInfo')).token
window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: 'http://localhost:6001',
  auth: {
    headers: {
      Authorization: JWTtoken
    }
  }
})

loadFonts()
createApp(App)
  .use(router)
  .use(vuetify)
  .use(Vue3Toasity, {
    autoClose: 4000
  })
  .mount('#app')
