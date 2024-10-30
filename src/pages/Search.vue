<template>
  <div class="search">
    <a-input-group compact class="search-box">
      <a-auto-complete
        v-model:value="keyword"
        placeholder="搜索"
        @select="onSearchHandle"
        @change="onSearchChange"
        @keydown.enter="onSearchHandle"
        :options="suggestList"
        class="search-input"
        :defaultActiveFirstOption="false"
      />
      <a-button @click="onSearchHandle">
        <v-icon #icon name="icon-sousuo" />
      </a-button>
    </a-input-group>
    <MusicList  :list="musicList" />
    <div class="pagination">
        <a-pagination simple @change="onPageChange" v-model:current="pageInfo.page" :total="pageInfo.numResults" show-less-items />
    </div>
    
  </div>
</template>
<script setup lang="ts">
import MusicList from "../components/MusicList.vue";
import {ref,onMounted, onActivated} from "vue";
import { useRoute } from "vue-router";
import { getSuggest,getSearchByType } from "../api/search";
const pageInfo=ref({
    page:1,
    pagesize:20,
    numPages:0,
    numResults:0
})
const route = useRoute();
const keyword = ref("");
const suggestList=ref([])
const musicList=ref([])
const onPageChange=(page:number, pageSize:number)=>{

    pageInfo.value.page=page
    pageInfo.value.pagesize=pageSize
    onSearch()
}
const onSearchHandle=()=>{
    pageInfo.value.page=1
    onSearch()
}
const onSearch = () => {
    // 
    getSearchByType({
        keyword:keyword.value,
        search_type:'video',
        page:pageInfo.value.page,
        pagesize:pageInfo.value.pagesize
    }).then(res=>{
        musicList.value=res.data.data.result
        pageInfo.value={
            page:res.data.data.page,
            pagesize:res.data.data.pagesize,
            numPages:res.data.data.numPages,
            numResults:res.data.data.numResults
        
        }
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
.pagination{
    margin: 15px 0;
}

</style>
