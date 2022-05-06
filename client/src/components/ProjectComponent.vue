<template>
    <div class="project-component">
        <div class="border project">
            <div class="h5 border-bottom bg-secondary text-light p-1">
              {{ project.name + " " }}
            </div>
            <div class="p-1">
              {{project.description}}
            </div>
          </div>
    </div>
</template>

<script>
export default {
    props: {
        project: Object
    }
}
</script>

<style>
@media screen and (min-width: 1024px) {
  .project{
    height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
} 
</style>