import { createApp } from "vue";
import "./style.css";
import "./assets/common.scss"
import App from "./App.vue";
import router from "./router";
import Icon from "./components/Icon.vue";
const app = createApp(App)
  .use(router)
  .component("v-icon", Icon)
  .mount("#app");

app.$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
