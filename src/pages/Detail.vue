<template>
  <div class="detail">
    <div class="info"></div>
    <div class="list">
      <a-table
        bordered
        v-if="detail?.View?.pages?.length"
        :dataSource="detail.View.pages"
        :columns="columns"
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'play'">
            <a-button size="small" @click="onPlay(record)">
              <template #icon>
                <v-icon name="icon-bofang" />
              </template>
            </a-button>
          </template>
          <template v-else-if="column.dataIndex === 'duration'">
            {{ formatDuration(text) }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getVideoDetailInfo } from "../api/music";
import { useStore } from "../store/index";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useStore();
const route = useRoute();
const bvid = ref("");
const detail = ref<any>({});
onMounted(() => {
  bvid.value = route.query.bvid as string;
  getDetail();
});
const getDetail = () => {
  getVideoDetailInfo({ bvid: bvid.value }).then((res) => {
    detail.value = res.data.data;
  });
};
const onPlay = (item: any) => {
  console.log(item);
  const mainData = {
    pic: detail.value.View.pic ,
    title: item.part,
    aid: detail.value.View.aid,
    bvid: bvid.value,
  };
  store.push({
    ...mainData,
    cid: item.cid,
    timelength: formatDuration(item.duration),
  });
  store.setPlayStatus("play");
};
const formatDuration = (duration: number) => {
  console.log(duration);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);
  console.log(hours, minutes, secs);
  return [padZero(hours), padZero(minutes), padZero(secs)].join(":");
};

const padZero = (num: number): string => {
  return num.toString().padStart(2, "0");
};
const columns = [
  {
    title: "视频选集",
    dataIndex: "part",
    key: "part",
    ellipsis: true,
  },
  {
    title: "时长",
    dataIndex: "duration",
    key: "duration",
    width: 90,
  },
  {
    title: "播放",
    dataIndex: "play",
    key: "play",
    width: 70,
  },
];
</script>
<style scoped lang="scss">
.detail {
  display: flex;
  // align-items: center;
  // justify-content: center;
  width: 100%;
  height: 100%;
  .info {
    flex: 1;
    min-width: 0;
    height: 100%;
  }
  .list {
    height: 100%;
    width: 40%;
    overflow-y: auto;
  }
}
</style>
