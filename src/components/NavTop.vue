<template>
  <div class="nav_top">
    <div class="top-left">
      <a-button class="back-btn" size="small" @click="back" v-if="showBack">
        <template #icon>
          <v-icon name="icon-houtui" />
        </template>
      </a-button>
      <div class="top-logo-box">
        <img class="top-logo" src="/image/bili_logo.svg" alt="" />
      </div>
      <div class="top-title" v-if="showBack">{{ route.name }}</div>
    </div>

    <div class="setting">
      <a-space>
        <a-button size="small" @click="winMin">
          <template #icon>
            <v-icon name="icon-zuixiaohua" />
          </template>
        </a-button>
        <a-button type="dashed" size="small" @click="fullScreen">
          <template #icon>
            <v-icon name="icon-pingmuquanping" />
          </template>
        </a-button>
        <a-button type="primary" danger size="small" @click="close">
          <template #icon>
            <v-icon name="icon-guanbi" />
          </template>
        </a-button>
      </a-space>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const showBack = computed(() => route.path !== "/home");
const back=()=>{
  router.back();
}
const fullScreen = () => {
  window.ipcRenderer.send("window-max");
};
const close = () => {
  window.ipcRenderer.send("close");
};
const winMin = () => {
  window.ipcRenderer.send("window-min");
};
</script>
<style scoped lang="scss">
.nav_top {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  -webkit-app-region: drag;

  .top-logo-box {
    .top-logo {
      height: 30px;
    }
  }
  .setting {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
  }
  .top-left{
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
    .top-title{
      margin-left: 15px;
    }
  }
  .back-btn{
    margin-right: 8px;
  }
}
</style>
