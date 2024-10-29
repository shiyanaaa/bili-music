<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#f16c8d',
      },
    }"
  >
  <div class="main-box">
    <RouterView></RouterView>
  </div>
  </a-config-provider>
  
 
</template>

<style lang="scss" scoped>
.main-box{
  min-height: 100vh;
  background-color: var(--color-background);
}
</style>
