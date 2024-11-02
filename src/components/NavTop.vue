<template>
  <div class="nav_top">
    <context-holder />
    <div class="top-left">
      <a-button class="back-btn" size="small" @click="back" v-if="showBack">
        <template #icon>
          <v-icon name="icon-houtui" />
        </template>
      </a-button>
      <div class="top-logo-box">
        <img class="top-logo" src="/image/bili_logo.svg" alt="" />
      </div>
      <div class="top-title" v-if="showBack">{{ route.name }}</div>
    </div>

    <div class="setting">
      <a-space>
        <a-button size="small" @click="doLogin" v-if="!avatar">
          <template #icon>
            <v-icon name="icon-weidenglu" />
          </template>
        </a-button>
        <a-dropdown :trigger="['click']" placement="bottom" v-else>
          <a-avatar style="cursor: pointer" size="small" :src="avatar" />
          <template #overlay>
            <a-menu @click="onClickUser">
              <a-menu-item key="1">
                <a href="javascript:;">更新数据</a>
              </a-menu-item>
              <a-menu-item key="2">
                <a href="javascript:;">退出登录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button size="small" @click="changeDark">
          <template #icon>
            <v-icon :name="isDarkVal ? 'icon-yueliang' : 'icon-taiyang'" />
          </template>
        </a-button>
        <a-button size="small" @click="winMin">
          <template #icon>
            <v-icon name="icon-zuixiaohua" />
          </template>
        </a-button>
        <a-button type="dashed" size="small" @click="fullScreen">
          <template #icon>
            <v-icon name="icon-pingmuquanping" />
          </template>
        </a-button>
        <a-button type="primary" danger size="small" @click="close">
          <template #icon>
            <v-icon name="icon-guanbi" />
          </template>
        </a-button>
      </a-space>
    </div>
    <LoginBox ref="loginBoxRef" />
  </div>
</template>
<script setup lang="ts">
import LoginBox from "./LoginBox.vue";
import { computed, inject, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../store";
import { useToggle } from "@vueuse/shared";
import { useDark } from "@vueuse/core";
import type { MenuProps } from "ant-design-vue";
import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();
const store = useStore();
const isDarkVal = inject("isDark") as Ref<boolean>;
const setDark = inject("setDark") as Function;
const loginBoxRef = ref();
const avatar = computed(() => store.getAvatar);
const changeDark = () => {
  toggle();
  setDark(!isDarkVal.value);
};
const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: "useDarkKEY",
  // 暗黑class名字
  valueDark: "dark",
  // 高亮class名字
  valueLight: "light",
});

const toggle = useToggle(isDark);

const route = useRoute();
const router = useRouter();
const showBack = computed(() => route.path !== "/home");
const back = () => {
  router.back();
};
const fullScreen = () => {
  window.ipcRenderer.send("window-max");
};
const close = () => {
  window.ipcRenderer.send("close");
};
const winMin = () => {
  window.ipcRenderer.send("window-min");
};
const doLogin = () => {
  loginBoxRef.value.show();
};
const onClickUser: MenuProps["onClick"] = ({ key }) => {
  console.log("点击用户");
  if (key === "1") {
    store.updateUserInfo(() => {
      messageApi.success("更新成功");
    });
  }
  else if (key === "2") {
    store.exitLogin(() => {
      messageApi.success("退出成功");
    });
  }
};
</script>
<style scoped lang="scss">
.nav_top {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  -webkit-app-region: drag;

  .top-logo-box {
    .top-logo {
      height: 30px;
    }
  }
  .setting {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
  }
  .top-left {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
    .top-title {
      margin-left: 15px;
    }
  }
  .back-btn {
    margin-right: 8px;
  }
}
</style>
