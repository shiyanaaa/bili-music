<template>
  <div class="detail">
    <div class="background">
      <img :src="detail?.View?.pic" alt="" />
    </div>
    <div class="detail-main">
      <div class="info">
        <div class="title">{{ detail?.View?.title }}</div>
        <div class="pic-box">
          <div class="pic">
            <img :src="detail?.View?.pic" alt="" />
          </div>
        </div>
        <div class="play">
          <a-button type="primary" size="large" @click="detailPlay">
            <template #icon>
              <v-icon name="icon-bofang" />
            </template>
            {{ isSong ? "播放" : "播放全部" }}
          </a-button>
        </div>
      </div>
      <div class="list" v-if="!isSong">
        <a-table
          bordered
          v-if="detail?.View?.pages?.length"
          :dataSource="detail.View.pages"
          :columns="columns"
          :pagination="false"
          :customRow="customRow"
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
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
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
const customRow = (record: any) => {
  return {
    onDblclick: () => {
      console.log("双击播放");
      onPlay(record);
    },
  };
};
const detailPlay = () => {
  if (isSong.value) {
    onPlay(detail.value?.View?.pages[0]);
    store.setPlayStatus("play");
  } else {
    const lists = detail.value?.View?.pages.map((item: any) => {
      return {
        pic: detail.value.View.pic,
        title: item.part,
        aid: detail.value.View.aid,
        bvid: bvid.value,
        cid: item.cid,
        timelength: formatDuration(item.duration),
      };
    });
    store.setPlayList(lists);
    store.setPlayStatus("play");
  }
};
const onPlay = (item: any) => {
  console.log(item);
  const mainData = {
    pic: detail.value.View.pic,
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
  
  return [padZero(hours), padZero(minutes), padZero(secs)].join(":");
};

const padZero = (num: number): string => {
  return num.toString().padStart(2, "0");
};
const isSong = computed(() => detail.value?.View?.pages?.length === 1);
const columns = [
  {
    title: "列表",
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
];
</script>
<style scoped lang="scss">
.detail {
  // align-items: center;
  // justify-content: center;
  width: 100%;
  height: 100%;

  position: relative;
  overflow: hidden;

  .detail-main {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    @media (min-width: 600px) {
      flex-direction: row;
      .info {
        flex: 1;
        min-width: 0;
        height: 100%;
        padding: 10px 10px 10px 0;
        position: relative;
        z-index: 10;
        .title {
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .pic-box {
          width: 100%;
          max-width: 800px;
          margin: 10px auto;
          .pic {
            width: 100%;
            padding-bottom: calc(100% * calc(9 / 16));
            position: relative;
            img {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              object-fit: cover;
              width: 100%;
              border-radius: 6px;
            }
          }
        }
        .play {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }
      }
      .list {
        height: 90%;
        width: 300px;
        min-height: 90%;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: var(--shadow);
        overflow-y: auto;
        background-color: var(--table-color);
      }
    }
  }

  .background {
    position: absolute;
    width: 120%;
    height: 120%;
    left: -10%;
    top: -10%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
  .info {
    width: 100%;
    position: relative;
    z-index: 10;
    .title {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .pic-box {
      width: 100%;
      max-width: 800px;
      margin: 10px auto;
      .pic {
        width: 100%;
        padding-bottom: calc(100% * calc(9 / 16));
        position: relative;
        img {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          object-fit: cover;
          width: 100%;
          border-radius: 6px;
        }
      }
    }
    .play {
      display: flex;
      justify-content: center;
      padding: 20px 0;
    }
  }
  .list {
    width: 100%;
    border-radius: 4px;
    box-shadow: var(--shadow);

    background-color: var(--table-color);
  }
}
</style>
