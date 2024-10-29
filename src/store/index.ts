import { defineStore } from 'pinia'

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useStore = defineStore('music', {
  
    state: () => {
        return {
            musicList:[] as Array<any>,
            current:0,
            playStatus:"pause"
        }
    },
    actions: {
        setPlayList(list:Array<any>){
            console.log('setPlayList',list);
            this.musicList = list
        },
        setPlayStatus(status:string){
            this.playStatus = status
        },
        push(item:any){
            // 在current位置插入
            this.musicList.splice(this.current,0,item)
            console.log('push',this.musicList)
        }
    },
    getters: {
        getMusicList: (state) => state.musicList,
        getCurrent: (state) => state.current,
        getPlayStatus: (state) => state.playStatus,
        getMusic: (state) => state.musicList[state.current]
    
    }
})