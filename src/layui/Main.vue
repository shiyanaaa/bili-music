<script setup lang="ts">
import NavTop from '../components/NavTop.vue'
</script>

<template>
  <div class="container">
    <NavTop />
    <div class="page">
        <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container{
    display: flex;
    flex-direction: column;

    .page{
        flex: 1;
        min-height: 0;
    }
}
</style>
