<template>
  <div class="d-flex min-vh-100">
    <div class="navbar bg-secondary p-0 border border-dark sidebar">
      <div class="container-fluid align-items-start p-0 fill">
        <ul class="navbar-nav w-100">
          <li class="nav-item">
            <router-link
              class="nav-link border text-light p-2"
              :class="activeClass('project')" to="/">Projects</router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link border text-light p-2"
              :class="activeClass('another')" to="/another">Another</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="w-100 border p-10">
      <router-view class="h-100" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    activeClass: function (...names) {
      for (let name of names) {
          if (name == this.$route.name)
              return 'active text-dark bg-light';
      }
    }
  }
}
</script>

<style scoped>
.sidebar{
  width: 20%;
}
.fill{
  height: 100%;
  min-height: 100%;
}
</style>