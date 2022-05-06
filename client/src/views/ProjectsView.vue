<template>
  <div class="projects">
    <div class="h1 p-2">Your projects</div>
    <div class="container-sm">
      <div class="row row-cols-4 g-2"> 
        <ProjectComponent
          class="col"
          v-for="project in projects"
          :key="project.id"
          :project="project" />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProjects } from "@/services/ProjectService"
import ProjectComponent from "@/components/ProjectComponent.vue"
export default {
  data () {
    return {
      projects: null
    }
  },
  components: {
    ProjectComponent
  },
  mounted: async function () {
    const response = await fetchProjects(localStorage.userId)
    this.projects = response.data
  },
  methods: {

  }
}
</script>

<style scoped>
</style>