<template>
  <nav class="navbar navbar-expand-sm bg-dark nav-tabs">
    <div class="container-fluid">
      <router-link class="navbar-brand text-light" to="/">
        IssueTracker
      </router-link>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link text-light" :class="activeClass('login')" to="/login">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-light" :class="activeClass('register')" to="/register">Register</router-link>
        </li>
      </ul>
    </div>
  </nav> 
  
  <div class="tab-content">
      <router-view class="tab-pane active" ></router-view>
  </div>
</template>

<script>
module.exports = {
  methods: {
      activeClass: function (...names) {
        for (let name of names) {
            if (name == this.$route.name)
                return 'active text-dark';
      }
    }    
}
}
</script>