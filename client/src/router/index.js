import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginService from '../components/LoginService.vue'
import RegisterService from '../components/RegisterService.vue'
import { isLoggedIn } from '../services/AuthenticationService.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      allowAnonymous: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginService,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterService,
    meta: {
      allowAnonymous: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if ((to.name == 'login' || to.name == 'register') && isLoggedIn()) {
    next({
      path: '/'
    })
    return
  }
  else if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      path:'/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  else {
    next()
  }
})

export default router
