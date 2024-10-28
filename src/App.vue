<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="main-box">
    <RouterView></RouterView>
  </div>
 
</template>

<style lang="scss" scoped>
.main-box{
  min-height: 100vh;
  background-color: var(--color-background);
}
</style>
