<template>
  <div class="index">
    <a-input-search
      v-model:value="keyword"
      placeholder="搜索"
      class="search"
      @search="onSearch"
    />
    <a-radio-group v-model:value="type" name="radioGroup">
      <a-radio value="1">歌曲</a-radio>
      <a-radio value="2">歌单</a-radio>
    </a-radio-group>
    <a-tabs @change="getHotMusicList" v-model:activeKey="activeKey" style="width: 100%; padding: 0 10px">
      <a-tab-pane :key="item.id" :tab="item.name" v-for="item in musicTypeList">
        <MusicList @play="onPlay" :list="musicList[item.id]" />
      </a-tab-pane>
    </a-tabs>
  </div>

  <!-- <div @click="getMusicDetail">123</div> -->
  
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getDetail, getVideoDetail, getHotListByRid } from "../api/music";
import { getEnc } from "../api/wbi";
import MusicList from "../components/MusicList.vue";
import { useStore } from '../store/index'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore()
const musicTypeList = ref([
  { name: "原创音乐", id: "28" },
  { name: "音乐现场", id: "29" },
  { name: "翻唱", id: "31" },
  { name: "演奏", id: "59" },
  { name: "乐评盘点", id: "243" },
  { name: "VOCALOID·UTAU", id: "30" },
  { name: "MV", id: "193" },
  { name: "音乐粉丝饭拍", id: "266" },
  { name: "AI音乐", id: "265" },
  { name: "电台", id: "267" },
  { name: "音乐教学", id: "244" },
  { name: "音乐综合", id: "130" },
]);
const activeKey = ref("28");
const keyword = ref("");
const type = ref("1");
const onSearch=()=>{

}

onMounted(() => {
  getHotMusicList();
});
const playUrl = ref<string>("");
const musicList = ref<any>({});
const onPlay=(item) => {
    getDetail({
        aid:item.aid,
        bvid:item.bvid
    }).then((res) => {
        const mainData= res.data.data
    getEnc({
      avid: item.aid,
      bvid:item.bvid,
      cid: res.data.data.cid,
      fnval: "16",
    }).then((params) => {
      getVideoDetail(params).then((res) => {
        store.push({
            ...mainData,
            audio: res.data.data.dash.audio[0].baseUrl
        })
        store.setPlayStatus('play')
      });
    });
  });
};

const getHotMusicList = () => {
  let id = activeKey.value;
  if (!musicList.value[id])
    getHotListByRid(id).then((res) => {
      musicList.value[id] = res.data.data;
    });
};
</script>
<style lang="scss">
.index {
  display: flex;
  flex-direction: column;
  align-items: center;
  .search {
    margin: 10px 0;
    max-width: 500px;
    width: 90%;
  }
}
</style>
