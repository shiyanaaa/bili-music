import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "../pages/Index.vue";
import Welcome from "../pages/Welcome.vue";
const routes = [
  { path: "/", component: Welcome },
  {
    path: "/main",
    component: () => import("../layui/Main.vue"),
    children: [
      { path: "/home", component: HomeView },
      { name:"搜索",path: "/search", component: () => import("../pages/Search.vue") },
      { name:"详情",path: "/detail", component: () => import("../pages/Detail.vue") },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
export default router;
