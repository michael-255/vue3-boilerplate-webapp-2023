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
      name: RouteName.INSPECT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/InspectView.vue'),
    },
    {
      path: '/create-new/:databaseTypeSlug',
      name: RouteName.CREATE_NEW,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/CreateNewView.vue'),
    },
    {
      path: '/create-for-id/:databaseTypeSlug/:id',
      name: RouteName.CREATE_FOR_ID,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/CreateForIdView.vue'),
    },
    {
      path: '/edit/:databaseTypeSlug/:id',
      name: RouteName.EDIT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/EditView.vue'),
    },
    {
      path: '/charts/:databaseTypeSlug/:id',
      name: RouteName.CHARTS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ChartsView.vue'),
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
