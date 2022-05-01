<template>
  <ul class="nav justify-content-center nav-tabs">
    <li class="nav-item">
      <router-link class="nav-link" :class="activeClass('home')" to="/">Home</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" :class="activeClass('register')" to="/register">Register</router-link>
    </li>
  </ul> 
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
                return 'active';
      }
    }    
}
}
</script>