<script setup lang="ts">
import { onMounted, ref, computed,provide } from "vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { theme } from "ant-design-vue";
import { useStore } from "./store";
const store=useStore()
const { darkAlgorithm, defaultAlgorithm } = theme;
const locale = ref(zhCN);
const themeData = computed(() => {
  return {
    algorithm: [isDark.value ? darkAlgorithm : defaultAlgorithm],
    token: {
      colorPrimary: "#f16c8d",
    },
  };
});
const isDark = ref(false);
provide("isDark", isDark)
onMounted(() => {
  // 获取系统亮色还是暗色
  const useDarkKEY = localStorage.getItem("useDarkKEY");
  if (!useDarkKEY || useDarkKEY == "auto") {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark.value = useDarkKEY == "dark";
  }
  let playList:any= localStorage.getItem("playList")
  if(playList){
    playList=JSON.parse(playList) as any[]
    store.setPlayList(playList)
  }
  const current:any= localStorage.getItem("current")
  if(current){
    store.setIndex(Number(current))
  }
  const playType=localStorage.getItem("playType")
  if(playType){
    store.setPlayType(playType)
  }
  store.updateUserInfo()
});
const setDark=(val:boolean)=>{
  isDark.value=val

}
provide("setDark", setDark)
</script>

<template>
  <a-config-provider :locale="locale" :theme="themeData">
    <div class="main-box">
      <RouterView></RouterView>
    </div>
  </a-config-provider>
</template>

<style lang="scss" scoped>
.main-box {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}
</style>
