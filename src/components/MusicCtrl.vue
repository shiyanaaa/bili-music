<template>
  <div class="music-ctrl">
    <div class="play-line" :style="lineStyle" @mouseup="onMouseUp"></div>
    <div class="ctrl-box">
      <div class="pic-box">
        <img v-if="music" :src="music.pic" alt="" />
      </div>
      <div class="ctrl">
        <div class="pre-next" @click="onPre">
          <Icon name="icon-shangyishou" />
        </div>
        <div class="play-pause" :class="playStatus" @click="stopPlay">
          <Icon :name="playStatus==='play'?'icon-07zanting':'icon-bofang'" />
        </div>

        <div class="pre-next" @click="onNext">
          <Icon name="icon-xiayishou" />
        </div>
      </div>
      <div></div>
    </div>
    <audio
      v-if="music && music.audio"
      ref="audioRef"
      :src="music.audio"
      controls
      @canplay="onCanPlay"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      style="display: none"
      @play="onPlay"
      @pause="onPause"
    ></audio>
  </div>
</template>
<script setup lang="ts">
import Icon from "./Icon.vue";
import { useStore } from "../store/index";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
import { ref, computed, watch } from "vue";
const music = computed(() => store.getMusic);
const playStatus = computed(() => store.playStatus);
const nextPlay = computed(() => store.nextPlay);
const audioRef = ref();
const onCanPlay = () => {
  if (playStatus.value === "play") audioRef.value && audioRef.value.play();
};
const onPlay=()=>{
  store.setPlayStatus('play')
}

const onPause=()=>{
  console.log("播放暂停");
  if(!audioRef.value ) return;
  if(!(audioRef.value.ended&&nextPlay.value))
  store.setPlayStatus('pause')
}
const onPre = () => {
  onPlay()
  store.prev();
};
const onNext = () => {
  onPlay()
  store.next();
};
const onMouseUp=(event:any) => {
  audioRef.value.currentTime=event.offsetX/event?.target?.offsetWidth*audioRef.value.duration
  playStatus.value==='play'
};
const playInfo = ref({
  duration: 0,
  currentTime: 0,
  playLine: 0,
});
const onTimeUpdate = () => {
  if (audioRef.value) {
    if(Number.isNaN(audioRef.value.duration)) return;
    playInfo.value = {
      duration: audioRef.value.duration,
      currentTime: audioRef.value.currentTime,
      playLine: (audioRef.value.currentTime / audioRef.value.duration) * 100,
    };
  }
};
const stopPlay=()=>{
  if(playStatus.value==='play'){
    audioRef.value.pause()
  }else{
    audioRef.value.play()
  }
}
const onEnded = () => {
  console.log("播放结束");
  console.log(nextPlay.value,playStatus.value);
  if (nextPlay.value && playStatus.value === "play") store.next();
};
const lineStyle = computed(() => {
  return {
    "--left": `-${100 - playInfo.value.playLine}%`,
  };
});
watch(
  () => store.playStatus,
  (newValue) => {
    if(!audioRef.value) return;
    if(newValue==='play'&& audioRef.value.paused){
      audioRef.value.play()
    }
  }
);
</script>
<style scoped lang="scss">
.music-ctrl {
  height: 100px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
  background-color: var(--color-background);
  background-color: var(--);
  .play-line {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color: #575757, $alpha: 0.1);
    height: 4px;
    cursor: pointer;
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background-color: #f16c8d;
      position: absolute;
      top: 0;
      left: var(--left, -100%);
    }
  }
  .ctrl-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    user-select: none;
    .ctrl {
      display: flex;
      align-items: center;
      .pre-next {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        background-color: rgba($color: #000000, $alpha: 0.05);
        border-radius: 4px;
        cursor: pointer;
        &:hover{
          background-color: rgba($color: #000000, $alpha: 0.1);
        }
      }
      .play-pause {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        background-color: rgba($color: #000000, $alpha: 0.05);
        border-radius: 50%;
        margin: 0 20px;
        cursor: pointer;
        &:hover{
          background-color: rgba($color: #000000, $alpha: 0.1);
        }
        &.pause{
          background-color: #f16c8d;
          color: #fff;
        }
      }
    }
    .pic-box {
      height: 80px;
      width: calc(80px * calc(16 / 9));
      user-select: none;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
}
</style>
