import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

// Define your routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route
    redirect: '/', // Redirect to Home
  },
]

const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
})

export default router
