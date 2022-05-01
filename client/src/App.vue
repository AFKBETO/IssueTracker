<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-dark nav-tabs">
      <div class="container-fluid">
        <router-link class="navbar-brand text-light" :to="getHomePage">
          IssueTracker
        </router-link>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link v-if="!isLoggedIn" class="nav-link text-light" :class="activeClass('login')" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="!isLoggedIn" class="nav-link text-light" :class="activeClass('register')" to="/register">Register</router-link>
          </li>
          <li class="nav-item">
            <button v-if="isLoggedIn" class="nav-link text-light" type="button" @click.prevent="changeLogin">Logout</button>
          </li>
        </ul>
      </div>
    </nav> 
    
    <div class="tab-content">
        <router-view
          class="tab-pane active"
          @login="changeLogin" />
    </div>
  </div>
</template>

<script>
module.exports = {
  data(){
    return {
      isLoggedIn: false,
    }
  },
  methods: {
      activeClass: function (...names) {
        for (let name of names) {
            if (name == this.$route.name)
                return 'active text-dark';
      }
    },
    changeLogin(){
      this.isLoggedIn = !this.isLoggedIn
    },
  },
  computed: {
    getHomePage(){
      return this.isLoggedIn? '/': '/login'
    }
  }
}
</script>