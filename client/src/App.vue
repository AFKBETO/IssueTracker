<template>
  <ul class="nav justify-content-center nav-tabs">
    <li class="nav-item">
      <router-link class="nav-link" to="/">Home</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link"  to="/register">Register</router-link>
    </li>
  </ul> 
  <router-view class="tab-pane container active" :id="$route.name" />
</template>

<script>
</script>