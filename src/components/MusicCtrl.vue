<template>
  <div class="music-ctrl">
    <div class="play-line" :style="lineStyle" @mouseup="onMouseUp"></div>
    <div class="ctrl-box">
      <div class="pic-box" @click="onShowDetail">
        <img v-if="music" :src="music.pic" alt="" />
        <div v-else class="pic">
          <v-icon name="icon-music"></v-icon>
        </div>
        <div class="title">{{ music.title }}</div>
      </div>
      <div class="ctrl">
        <a-space>
          <a-button @click="onPre">
            <template #icon>
              <v-icon name="icon-shangyishou" />
            </template>
          </a-button>
          <a-button type="primary" size="large" @click="stopPlay">
            <template #icon>
              <v-icon
                v-if="!loading"
                :name="playStatus === 'play' ? 'icon-07zanting' : 'icon-bofang'"
              />
              <v-icon v-else name="icon-loading1" loading />
            </template>
          </a-button>
          <a-button @click="onNext">
            <template #icon>
              <v-icon name="icon-xiayishou" />
            </template>
          </a-button>
        </a-space>
      </div>
      <div>
        <a-button @click="showPlayListHandle">
          <template #icon>
            <v-icon name="icon-liebiao" />
          </template>
        </a-button>
      </div>
    </div>
    <audio
      v-if="music && playUrl"
      ref="audioRef"
      :src="playUrl"
      controls
      @canplay="onCanPlay"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      style="display: none"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
    ></audio>
  </div>
  <a-drawer
    :headerStyle="headerStyle"
    :closable="false"
    height="100vh"
    :title="music ? music.title : ''"
    placement="bottom"
    :open="showDetail"
    @close="onCloseDetail"
  >
    <template #extra>
      <a-space class="action">
        <a-button type="primary" size="small" @click="onCloseDetail">
          <template #icon>
            <v-icon name="icon-xiangxiazhankai" />
          </template>
        </a-button>
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
    </template>
    <div class="background" :style="backgroundStyle"></div>
    <div class="main">
      <div class="pan-box">
        <div class="play-pan" :class="{ run: playStatus === 'play' }">
          <img :src="music.pic" alt="" />
        </div>
      </div>
      <div class="main-bottom">
        <div class="slider" @mousedown="onSliderMouseDown" @mouseup="onSliderMouseDown">
          <a-slider
            v-model:value="sliderVal"
            @afterChange="onSliderChange"
          />
        </div>
        <div class="main-ctrl">
          <div>
            <a-button  @click="showPlayListHandle">
              <template #icon>
                <v-icon name="icon-liebiao" />
              </template>
            </a-button>
          </div>
          <a-space>
            <a-button @click="onPre">
              <template #icon>
                <v-icon name="icon-shangyishou" />
              </template>
            </a-button>
            <a-button type="primary" size="large" @click="stopPlay">
              <template #icon>
                <v-icon
                  v-if="!loading"
                  :name="
                    playStatus === 'play' ? 'icon-07zanting' : 'icon-bofang'
                  "
                />
                <v-icon v-else name="icon-loading1" loading />
              </template>
            </a-button>
            <a-button @click="onNext">
              <template #icon>
                <v-icon name="icon-xiayishou" />
              </template>
            </a-button>
          </a-space>
          <div>
            <a-button @click="showPlayListHandle">
              <template #icon>
                <v-icon name="icon-liebiao" />
              </template>
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
  <a-drawer
    title="播放列表"
    placement="right"
    :headerStyle="playListHeaderStyle"
    :open="showPlayList"
    @close="onClosePlayList"
  >
    <a-list item-layout="horizontal" :data-source="playList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta style="cursor: pointer" @click="changePlay(item)">
            <template #title>
              <a class="one-line block">{{ item.title }}</a>
            </template>
            <template #avatar>
              <a-image
                style="border-radius: 4px"
                :width="80"
                :height="45"
                :preview="false"
                :src="item.pic"
              />
            </template>
            <template #description>
              <div>{{ item.timelength }}</div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>
<script setup lang="ts">
import { useStore } from "../store/index";
import { getVideoDetail } from "../api/music";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
import { ref, computed, watch, onMounted } from "vue";
const music = computed(() => store.getMusic);
const playStatus = computed(() => store.playStatus);
const nextPlay = computed(() => store.nextPlay);
const audioRef = ref();
const playList = computed(() => store.getMusicList);
const onCanPlay = () => {
  loading.value = false;
  if (playStatus.value === "play") audioRef.value && audioRef.value.play();
};
const sliderVal = ref(0);
const changeFlag = ref(false);
const onSliderMouseDown = () => {
  console.log("开始拖动");
  changeFlag.value = true;
};
const onSliderMouseUp = () => {
  changeFlag.value = false;
};
const onSliderChange = (val: number) => {
  changeFlag.value = false;
  audioRef.value.currentTime = (val / 100) * audioRef.value.duration;
};
const showPlayList = ref(false);
const loading = ref(false);
const showPlayListHandle = () => {
  showPlayList.value = true;
};
onMounted(() => {
  if (music.value && music.value.cid) getPlayUrl(music.value);
});
const onClosePlayList = () => {
  showPlayList.value = false;
};
const changePlay = (item: any) => {
  store.changePlayById(item.aid);
  store.setPlayStatus("play");
};
const headerStyle = {
  position: "relative",
  zIndex: 9999,
};
const playListHeaderStyle = {
  "-webkit-app-region": "no-drag",
};
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${music.value.pic})`,
  };
});
const showDetail = ref<boolean>(false);
const onShowDetail = () => {
  showDetail.value = true;
};
const onCloseDetail = () => {
  showDetail.value = false;
};
const onPlay = () => {
  store.setPlayStatus("play");
};

const onPause = () => {
  console.log("播放暂停");
  if (!audioRef.value) return;
  if (!(audioRef.value.ended && nextPlay.value)) store.setPlayStatus("pause");
};
const onError = () => {
  loading.value = false;
  console.log("播放错误");
  if (nextPlay.value) {
    store.next();
  } else {
    store.setPlayStatus("pause");
  }
};
const onPre = () => {
  onPlay();
  store.prev();
};
const onNext = () => {
  onPlay();
  store.next();
};
const onMouseUp = (event: any) => {
  audioRef.value.currentTime =
    (event.offsetX / event?.target?.offsetWidth) * audioRef.value.duration;
};
const playInfo = ref({
  duration: 0,
  currentTime: 0,
  playLine: 0,
});
const onTimeUpdate = () => {
  if (audioRef.value) {
    if (Number.isNaN(audioRef.value.duration)) return;
    playInfo.value = {
      duration: audioRef.value.duration,
      currentTime: audioRef.value.currentTime,
      playLine: (audioRef.value.currentTime / audioRef.value.duration) * 100,
    };
    if (!changeFlag.value) sliderVal.value = playInfo.value.playLine;
  }
};
const stopPlay = () => {
  if (!music.value) return;
  if (!playUrl.value) {
    getPlayUrl(music.value);
    store.setPlayStatus("play");
    return;
  }
  if (playStatus.value === "play") {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
};
const onEnded = () => {
  console.log("播放结束");
  console.log(nextPlay.value, playStatus.value);
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
    if (!audioRef.value) return;
    if (newValue === "play" && audioRef.value.paused) {
      audioRef.value.play();
    }
  }
);
const playUrl = ref("");
watch(
  () => store.getMusic,
  (newValue, oldValue) => {
    if (!newValue) return;
    if (oldValue && newValue.cid === oldValue.cid) return;
    getPlayUrl(newValue);
  }
);
const getPlayUrl = (newValue: any) => {
  loading.value = true;
  getVideoDetail({
    aid: newValue.aid,
    bvid: newValue.bvid,
    cid: newValue.cid,
    fnval: "16",
  }).then(
    (res) => {
      playUrl.value = res.data.data.dash.audio[0].baseUrl;
    },
    () => {
      console.log("播放失败");
      loading.value = false;
    }
  );
};
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
    }

    .pic-box {
      height: 80px;
      width: calc(80px * calc(16 / 9));
      display: flex;
      user-select: none;
      .title {
        width: 300px;
        padding: 10px;
        flex-shrink: 0;
      }
      .pic {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
}

.background {
  position: absolute;
  width: 120%;
  height: 120%;
  left: -10%;
  top: -10%;
  background-size: cover;
  filter: blur(20px);

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: var(--back-color);
  }
}
.main {
  position: relative;
  z-index: 99;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  .pan-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .play-pan {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      border: 15px solid #000;
      position: relative;
      @media (min-width: 375px) {
        width: 250px;
        height: 250px;
        padding-bottom: 0;
      }
      @media (min-width: 500px) {
        width: 300px;
        height: 300px;
        padding-bottom: 0;
      }
      &.run {
        animation: loading 10s linear infinite;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .main-bottom {
    width: 100%;
    .main-ctrl {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.action {
  -webkit-app-region: no-drag;
}
</style>
