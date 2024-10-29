import { defineStore } from "pinia";

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useStore = defineStore("music", {
  state: () => {
    return {
      musicList: [] as Array<any>,
      current: 0,
      playStatus: "pause",
    };
  },
  actions: {
    setPlayList(list: Array<any>) {
      console.log("setPlayList", list);
      this.musicList = list;
    },
    setPlayStatus(status: string) {
      this.playStatus = status;
    },
    push(itemData: any) {
      // 在current位置插入
      if(this.musicList.length===0){
        this.current=0
        this.musicList.push(itemData)
      }
      const insrectId = this.musicList[this.current].aid;
      const newList= this.musicList.filter((item) => item.aid !== itemData.aid)
      const newIndex=newList.findIndex(item=>item.aid===insrectId)
      if(newIndex>=0)  {
        this.current=newIndex
        newList.splice(newIndex, 0, itemData);
        this.musicList=newList
      }
      else {
        newList.splice(this.current, 0, itemData);
        this.musicList=newList
      }
      console.log("push", this.musicList);
    },
    next() {
      // 下一首
      if (this.nextPlay) this.current++;
    },
    prev() {
      // 上一首
      if (this.prevPlay) this.current--;
    },
  },
  getters: {
    getMusicList: (state) => state.musicList,
    getCurrent: (state) => state.current,
    getPlayStatus: (state) => state.playStatus,
    getMusic: (state) => state.musicList[state.current],
    nextPlay: (state) => !!state.musicList[state.current + 1],
    prevPlay: (state) => !!state.musicList[state.current - 1],
  },
});
