<template>
  <div class="musicList">
    <div
      class="musicItem"
      @click="toMusicDetail(item)"
      v-for="item in props.list"
      :key="item.aid"
    >
      <div class="musicItem-img">
        <img :src="item.pic" alt="" />
        <div class="play">
          <a-button   @click.stop="onPlay(item)">
          <template #icon>
            <v-icon name="icon-bofang" />
          </template>
        </a-button>
        </div>
      </div>
      <div class="musicItem-title" v-html="item.title"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDetail } from "../api/music";
import { useRouter } from "vue-router";
import { useStore } from "../store/index";
const router=useRouter()
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
const emit = defineEmits(["play"]);
const props = defineProps({
  list: { type: Array<any>, default: () => [] },
});
const onPlay = (item: any) => {
  getDetail({
    aid: item.aid,
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
};
// const secondsToHHMMSS = (seconds: number): string => {
//   seconds = seconds / 1000;
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = Math.floor(seconds % 60);

//   return [padZero(hours), padZero(minutes), padZero(secs)].join(":");
// };

// const padZero = (num: number): string => {
//   return num.toString().padStart(2, "0");
// };
const toMusicDetail=(item:any)=>{
  router.push(`/detail?bvid=${item.bvid}`)
}
</script>

<style scoped lang="scss">
@import "../assets/mixin.scss";
$num: (
  "0px": 1,
  "375px": 2,
  "600px": 3,
  "992px": 4,
  "1200px": 5,
);
.musicList {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  .musicItem {
    margin-right: 10px;
    margin-bottom: 5px;
    @each $name, $glyph in $num {
      @media (min-width: #{$name}) {
        width: calc(calc(100% - calc(10px * calc(#{$glyph} - 1))) / #{$glyph});

        &:nth-child(#{$glyph}n) {
          margin-right: 0;
        }
        &:not(:nth-child(#{$glyph}n)) {
          margin-right: 10px;
        }
      }
    }
    // width: calc(calc(100% - calc(10px * #{$num - 1})) / #{$num});

    .musicItem-img {
      width: 100%;
      padding-bottom: calc(100% * calc(9 / 16));
      position: relative;
      cursor: pointer;
      .play{
        position: absolute;
        display: flex;
        right: 10px;
        bottom: 10px;
      }
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        border-radius: 8px;
      }
    }
    .musicItem-title {
      margin: 8px 0;
      @include show_line(2);
      cursor: pointer;
      font-size: 14px;
      line-height: 1.2;
      height: 2.4em;
      &:hover {
        color: #f16c8d;
      }
      :deep(.keyword) {
        font-style: unset;
      }
    }
  }
}
</style>
