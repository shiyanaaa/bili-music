import { createApp } from "vue";
import "./style.css";
import "./assets/common.scss"
import App from "./App.vue";
import router from "./router";
import Icon from "./components/Icon.vue";
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css';
const pinia = createPinia()
const app = createApp(App)
  .use(router)
  .use(Antd)
  .use(pinia)
  .component("v-icon", Icon)
  .mount("#app");

app.$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
