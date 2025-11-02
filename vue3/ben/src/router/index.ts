import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tools-home',
      component: () => import('../views/ToolsHomeView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/app-info',
      name: 'app-info',
      component: () => import('../views/AppInfoView.vue'),
    },
    {
      path: '/mrt-fare-finder',
      name: 'mrt-fare-finder',
      component: () => import('../views/MrtFareFinderView.vue'),
    },
    // Redirect old portfolio route to about
    {
      path: '/portfolio',
      redirect: '/about',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80,
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
