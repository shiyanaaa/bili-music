<template>
  <context-holder />
  <div class="music-ctrl">
    <div class="play-line" :style="lineStyle" @mouseup="onMouseUp"></div>
    <div class="ctrl-box">
      <div class="pic-box">
        <img v-if="music" :src="music.pic" alt="" @click="onShowDetail" />
        <div v-else class="pic">
          <v-icon name="icon-music"></v-icon>
        </div>
        <div class="title">{{ music ? music.title : "" }}</div>
      </div>
      <div class="ctrl">
        <a-space>
          <a-button @click="onPre" class="pre-btn">
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
          <a-button @click="showPlayListHandle" class="playListBtn">
            <template #icon>
              <v-icon name="icon-liebiao" />
            </template>
          </a-button>
        </a-space>
      </div>
      <div class="ctrl-right">
        <a-space>
          <a-button @click="changePlayType">
            <template #icon>
              <v-icon :name="playTypeMap[playType].icon" />
            </template>
          </a-button>
          <a-button @click="showFavListHandle">
            <template #icon>
              <v-icon name="icon-shoucang2" />
            </template>
          </a-button>
          <a-button @click="showPlayListHandle">
            <template #icon>
              <v-icon name="icon-liebiao" />
            </template>
          </a-button>
        </a-space>
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
        <div class="slider" @mousedown="onSliderMouseDown">
          <a-slider v-model:value="sliderVal" @afterChange="onSliderChange" />
        </div>
        <div class="main-ctrl">
          <div>
            <a-button @click="changePlayType">
              <template #icon>
                <v-icon :name="playTypeMap[playType].icon" />
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
    <a-list class="card-list" item-layout="horizontal" :data-source="playList">
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
  <a-drawer
    title="收藏列表"
    placement="right"
    :headerStyle="playListHeaderStyle"
    :open="showFavList"
    @close="onCloseFavList"
  >
    <a-collapse @change="onFavChange" accordion v-model:activeKey="chooseFav">
      <a-collapse-panel v-for="item in favList" :key="item.id">
        <template v-slot:header>
          <div class="fav-title">
            <div class="fav-name">
              {{ `${item.title}(${item.media_count})` }}
            </div>
            <a-button type="primary" @click.stop size="small"
              >播放全部</a-button
            >
          </div>
        </template>
        <a-list v-if="(favListContent.length!==0||!favItemLoading)" class="card-list" item-layout="horizontal" :data-source="favListContent">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                style="cursor: pointer"
                @click="playItem(item)"
              >
                <template #title>
                  <a class="one-line block">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-image
                    style="border-radius: 4px"
                    :width="80"
                    :height="45"
                    :preview="false"
                    :src="item.cover"
                  />
                </template>
                <template #description>
                  <div>{{ item.duration }}</div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <div class="has_more" v-if="hasMore">
          <a-button type="link" @click="loadMore">加载更多</a-button>
        </div>
        <div class="fav-item-loading" v-if="favItemLoading">
          <a-spin />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </a-drawer>
</template>
<script setup lang="ts">
import { useStore } from "../store/index";
import { getVideoDetail } from "../api/music";
import { getFavList, getFavListContentByMid } from "../api/fav";
import { getDetail } from "../api/music";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
import { message } from "ant-design-vue";
const [messageApi, contextHolder] = message.useMessage();
import { ref, computed, watch, onMounted } from "vue";
const music = computed(() => store.getMusic);
const playStatus = computed(() => store.playStatus);
const nextPlay = computed(() => store.nextPlay);
const playType = computed(() => store.playType);
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
const onSliderChange = (val: number) => {
  changeFlag.value = false;
  audioRef.value.currentTime = (val / 100) * audioRef.value.duration;
};
const showPlayList = ref(false);
const loading = ref(false);
const showPlayListHandle = () => {
  showPlayList.value = true;
};
const showFavList = ref(false);
const favList = ref<any>([]);
const chooseFav = ref("");
const showFavListHandle = () => {
  if (!store.userInfo) {
    messageApi.warning("请先登录");
    return;
  }
  showFavList.value = true;
  getFavList(store.userInfo.mid).then((res) => {
    console.log(res.data.data.list);
    favList.value = res.data.data.list;
  });
};
const favItemLoading = ref(false);
onMounted(() => {
  if (music.value && music.value.cid) getPlayUrl(music.value);
});
const onClosePlayList = () => {
  showPlayList.value = false;
};
const onCloseFavList = () => {
  showFavList.value = false;
};
const changePlay = (item: any) => {
  store.changePlayById(item);
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
const playTypeList = [
  { name: "顺序播放", icon: "icon-liebiaoxunhuan", value: "order" },
  { name: "单曲循环", icon: "icon-danquxunhuan-qianhuise", value: "one" },
  { name: "随机播放", icon: "icon-suijibofang", value: "random" },
];
const playTypeMap: any = {};
playTypeList.forEach((item) => {
  playTypeMap[item.value] = item;
});
const changePlayType = () => {
  const index = playTypeList.findIndex((item) => item.value === playType.value);
  if (index >= playTypeList.length - 1) {
    store.setPlayType(playTypeList[0].value);
  } else {
    store.setPlayType(playTypeList[index + 1].value);
  }
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
    if (Number.isNaN(audioRef.value.duration)) {
      playInfo.value.playLine = 0;
      return;
    }
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
const pages = ref(1);
const favListContent = ref<any>([]);
const onFavChange = (key:any) => {
  pages.value = 1;
  favListContent.value=[]
  if(key)
  getFavListContent();
};
const loadMore=()=>{
  pages.value++;
  getFavListContent();
}
const formatDuration = (duration: number) => {
  console.log(duration);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);
  
  return [padZero(hours), padZero(minutes), padZero(secs)].join(":");
};
const padZero = (num: number): string => {
  return num.toString().padStart(2, "0");
};
const hasMore=ref(false)
const getFavListContent = () => {
  favItemLoading.value = true;
  hasMore.value=false;
  getFavListContentByMid(chooseFav.value, pages.value)
    .then((res) => {
      const data=res.data.data.medias.map((item:any)=>{
        return {
          ...item,
          duration:formatDuration(item.duration)
        }
      })
      favListContent.value=[...favListContent.value,...data];
      hasMore.value=res.data.data.has_more;
    })
    .finally(() => {
      favItemLoading.value = false;
    });
};
const playItem=(item:any)=>{
  console.log(item);
  if(item.attr!==0){

    messageApi.warning("当前稿件已失效")
    return;
  }
  getDetail({
    aid: item.id,
    bvid: item.bvid,
  }).then((res) => {
    const mainData = res.data.data;
    store.push({
      pic: mainData.pic,
      title: mainData.title,
      aid: mainData.aid,
      bvid: mainData.bvid,
      cid:mainData.cid
    });
    store.setPlayStatus("play");
  });
}
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
    padding: 0 15px;
    user-select: none;
    .ctrl {
      display: flex;
      align-items: center;
    }
    .ctrl-right {
      margin-left: 40px;
      @media (max-width: 550px) {
        display: none;
      }
    }
    .playListBtn {
      @media (min-width: 550px) {
        display: none;
      }
    }
    .pre-btn {
      @media (max-width: 550px) {
        display: none;
      }
    }
    .pic-box {
      height: 80px;
      display: flex;
      user-select: none;
      flex: 1;
      min-width: 0;
      .title {
        padding: 10px;
        flex-shrink: 0;
        font-size: 14px;
        width: unset;
        flex: 1;
        min-width: 0;
      }

      .pic {
        width: calc(80px * calc(16 / 9));
        height: 80px;
        border-radius: 4px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        @media (max-width: 550px) {
          width: calc(60px * calc(16 / 9));
          height: 60px;
          margin: 10px 0;
        }
      }
      img {
        width: calc(80px * calc(16 / 9));
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        @media (max-width: 550px) {
          width: calc(60px * calc(16 / 9));
          height: 60px;
          margin: 10px 0;
        }
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
.fav-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fav-item-loading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action {
  -webkit-app-region: no-drag;
}
.card-list{
  :deep(.ant-list-item){
    padding-left: 0;
    padding-right: 0;
  }
}
.has_more{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
