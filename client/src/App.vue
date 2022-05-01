<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-dark nav-tabs">
      <div class="container-fluid">
        <router-link class="navbar-brand text-light" to="/">
          IssueTracker
        </router-link>
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!isLoggedIn()">
            <router-link class="nav-link text-light" :class="activeClass('login')" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-show="!isLoggedIn()">
            <router-link class="nav-link text-light" :class="activeClass('register')" to="/register">Register</router-link>
          </li>
          <li class="nav-item mt-2" v-show="isLoggedIn()">
            <p class="text-light">Hello, {{ getName() }}!</p>
          </li>
          <li class="nav-item" v-show="isLoggedIn()">
            <button class="nav-link text-light" type="button" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav> 
    <div class="tab-content">
        <router-view
          class="tab-pane active" />
    </div>
  </div>
</template>

<script>
import { logout, isLoggedIn } from './services/AuthenticationService.js'

export default {
  methods: {
      activeClass: function (...names) {
        for (let name of names) {
            if (name == this.$route.name)
                return 'active text-dark';
      }
    },
    logout(){
      logout()
      this.$router.push('/login')
    },
    isLoggedIn(){
      return isLoggedIn()
    },
    getName(){
      return localStorage.displayName
    }
  },
  computed: {
    
  }
}
</script>