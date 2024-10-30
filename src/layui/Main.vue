<script setup lang="ts">
import NavTop from "../components/NavTop.vue";
import MusicCtrl from "../components/MusicCtrl.vue";
</script>

<template>
  <div class="container">
    <NavTop />
    <div class="page">
      <router-view />
    </div>
    <MusicCtrl />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  flex: 1;
  min-height: 0;
  .page {
    flex: 1;
    min-height: 0;
  }
}
</style>
