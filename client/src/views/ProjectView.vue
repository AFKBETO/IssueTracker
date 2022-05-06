<template>
  <div class="project">
    <h1>Your projects</h1>
    <div class="container-sm">
      <div class="row row-cols-4 g-2"> 
        <div class="col" v-for="project in projects" :key="project.id">
          <div class="border project">
            <div class="h5">
              {{project.name}}
            </div>
            <div>
              {{project.description}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProjects } from "@/services/ProjectService"
export default {
  data () {
    return {
      projects: null
    }
  },
  mounted: async function () {
    const response = await fetchProjects(localStorage.userId)
    this.projects = response.data
  },
}
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .project{
    height:250px;
  }
} 
</style>