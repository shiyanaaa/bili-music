<template>
  <div class="nav_top">
    <div class="top-logo-box">
      <img class="top-logo" src="/image/bili_logo.svg" alt="" />
    </div>
    <div class="setting">
        <div class="setting-item" @click="winMin">
            <v-icon name="icon-zuixiaohua" />
        </div>
        <div class="setting-item" @click="fullScreen">
            <v-icon name="icon-pingmuquanping" />
        </div>
        <div class="setting-item" @click="close">
            <v-icon name="icon-guanbi" />
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const fullScreen=()=>{
    window.ipcRenderer.send("window-max")
}
const close=()=>{
    window.ipcRenderer.send("close")
}
const winMin=()=>{
    window.ipcRenderer.send("window-min")
}
</script>
<style scoped lang="scss">
.nav_top {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  -webkit-app-region: drag;

  
  .top-logo-box {
    .top-logo {
      height: 30px;
    }
  }
  .setting{
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
    .setting-item{
        -webkit-app-region: no-drag;
        width: 40px;
        height: 40px;
        display: flex;
        font-size: 20px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:not(:last-child){
            margin-right: 10px;
        }
        
        &:hover{
            background: #eee;
        }
    }
  }
}
</style>
