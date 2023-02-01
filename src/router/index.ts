import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/constants/globals'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/examples',
      name: RouteName.EXAMPLES,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ExamplesView.vue'),
    },
    {
      path: '/reports',
      name: RouteName.REPORTS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ReportsView.vue'),
    },
    {
      path: '/settings',
      name: RouteName.SETTINGS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/about',
      name: RouteName.ABOUT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 404 Not Found
      name: RouteName.NOT_FOUND,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
