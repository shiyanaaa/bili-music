<template>
  <div class="search">
    <a-input-group compact class="search-box">
      <a-auto-complete
        v-model:value="keyword"
        placeholder="搜索"
        @select="onSearch"
        @change="onSearchChange"
        @keydown.enter="onSearch"
        :options="suggestList"
        class="search-input"
        :defaultActiveFirstOption="false"
      />
      <a-button @click="onSearch">
        <v-icon #icon name="icon-sousuo" />
      </a-button>
    </a-input-group>
    <MusicList  :list="musicList" />
  </div>
</template>
<script setup lang="ts">
import MusicList from "../components/MusicList.vue";
import {ref,onMounted, onActivated} from "vue";
import { useRoute } from "vue-router";
import { getSuggest,getSearchByType } from "../api/search";

const route = useRoute();
const keyword = ref("");
const suggestList=ref([])
const musicList=ref([])
const onSearch = () => {
    // 
    getSearchByType({
        keyword:keyword.value,
        search_type:'video'
    }).then(res=>{
        musicList.value=res.data.data.result
    })
};
const onSearchChange = () => {
  getSuggest(keyword.value).then((res) => {
    console.log(res.data);
    suggestList.value = res.data.result.tag;
  });
};
onMounted(()=>{
    keyword.value=route.query.keyword as string
    onSearch()
})
onActivated(()=>{
    keyword.value=route.query.keyword as string
    onSearch()
})
</script>
<style scoped lang="scss">
.search{
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
