import { createRouter, createWebHistory } from "@ionic/vue-router"
import type { RouteRecordRaw } from "vue-router"
import BusinessDashboard from "../views/BusinessDashboard.vue"
import TechnicalDashboard from "../views/TechnicalDashboard.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/business",
  },
  {
    path: "/business",
    name: "Business",
    component: BusinessDashboard,
  },
  {
    path: "/technical",
    name: "Technical",
    component: TechnicalDashboard,
  },
]

const router = createRouter({
  history: createWebHistory("/"),
  routes,
})

export default router
