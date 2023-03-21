import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/router/route-names'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.DASHBOARD,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/data/:databaseTypeSlug',
      name: RouteName.DATA,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DataView.vue'),
    },
    {
      path: '/inspect/:databaseTypeSlug/:id',
      name: RouteName.ACTION_INSPECT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionInspectView.vue'),
    },
    {
      // parentId is optional for creating child records with a specific parent id
      path: '/create/:databaseTypeSlug/:parentId?',
      name: RouteName.ACTION_CREATE,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionCreateView.vue'),
    },
    {
      path: '/edit/:databaseTypeSlug/:id',
      name: RouteName.ACTION_EDIT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionEditView.vue'),
    },
    {
      path: '/charts/:databaseTypeSlug/:id',
      name: RouteName.ACTION_CHARTS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionChartsView.vue'),
    },
    {
      path: '/settings',
      name: RouteName.SETTINGS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/faq',
      name: RouteName.FAQ,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/FAQView.vue'),
    },
    {
      path: '/about',
      name: RouteName.ABOUT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/donate',
      name: RouteName.DONATE,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DonateView.vue'),
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
