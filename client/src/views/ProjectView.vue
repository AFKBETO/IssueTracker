<template>
    <div class="project">
        <div class="h1 p-2">{{ project.name }}</div>
        <div class="container-sm">
            <div class="row row-cols-4 g-2">

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

</style>