import { createRouter, createWebHistory } from "@ionic/vue-router"
import type { RouteRecordRaw } from "vue-router"
import SwaplyDashboard from "../views/SwaplyDashboard.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/swaply",
  },
  {
    path: "/swaply",
    name: "swaply",
    component: SwaplyDashboard,
  }
]

const router = createRouter({
  history: createWebHistory("/"),
  routes,
})

export default router