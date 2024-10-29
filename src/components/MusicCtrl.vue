<template>
  <div class="music-ctrl">
    <audio
      v-if="music && music.audio"
      ref="audioRef"
      :src="music.audio"
      controls
      @canplay="onCanPlay"
    ></audio>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "../store/index";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
import { ref, computed } from "vue";
const music = computed(() => store.getMusic);
const playStatus = computed(() => store.playStatus);
const audioRef = ref();
const onCanPlay = () => {
  if (playStatus.value === "play") audioRef.value && audioRef.value.play();
};
</script>
<style scoped lang="scss">
.music-ctrl {
  height: 100px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: aqua;
  width: 100vw;
}
</style>
