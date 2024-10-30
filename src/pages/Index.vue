<template>
  <div class="index">
    <a-input-group compact class="search-box">
      <a-auto-complete
        v-model:value="keyword"
        placeholder="搜索"
        @select="onSearch"
        @change="onSearchChange"
        @pressEnter="onSearch"
        :options="suggestList"
        class="search-input"
        :defaultActiveFirstOption="false"
        @keydown.enter="onSearch"
      />
      <a-button @click="onSearch">
        <v-icon #icon name="icon-sousuo" />
      </a-button>
    </a-input-group>

    <a-radio-group v-model:value="type" name="radioGroup">
      <a-radio value="1">歌曲</a-radio>
      <a-radio value="2">歌单</a-radio>
    </a-radio-group>
    <a-tabs
      @change="getHotMusicList"
      v-model:activeKey="activeKey"
      style="width: 100%; padding: 0 10px"
    >
      <a-tab-pane :key="item.id" :tab="item.name" v-for="item in musicTypeList">
        <MusicList  :list="musicList[item.id]" />
      </a-tab-pane>
    </a-tabs>
  </div>

  <!-- <div @click="getMusicDetail">123</div> -->
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getHotListByRid } from "../api/music";
import MusicList from "../components/MusicList.vue";
import { getSuggest } from "../api/search";
import { useRouter } from "vue-router";
// 可以在组件中的任意位置访问 `store` 变量 ✨

const router=useRouter()
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
const onSearch = () => {
  console.log("search",keyword.value)
  router.push(`/search?keyword=${keyword.value}`)
};
const suggestList = ref([]);
const onSearchChange = () => {
  getSuggest(keyword.value).then((res) => {
    console.log(res.data);
    suggestList.value = res.data.result.tag;
  });
};
onMounted(() => {
  getHotMusicList();
});
const musicList = ref<any>({});



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
  height: 100%;
  overflow-y: auto;
  .search-box {
    margin: 10px 0;
    max-width: 500px;
    width: 90%;
    display: flex;
    .search-input{
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
