import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import AuthView from '../views/AuthView.vue'
import TestCallView from '@/views/TestCallView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthView,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/auth/LoginForm.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../components/auth/RegisterForm.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user',
      name: 'user',
      component: UserView
    },
    {
      path: '/testcall',
      name: 'testcall',
      component: TestCallView
    }
  ]
})

export default router
