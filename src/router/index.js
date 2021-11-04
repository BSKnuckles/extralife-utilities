import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/progress',
        name: 'Progress',
        component: () =>
            import(/* webpackChunkName: "progress" */ '../views/Progress.vue'),
    },
    {
        path: '/alerts',
        name: 'Alerts',
        component: () =>
            import(/* webpackChunkName: "alerts" */ '../views/Alerts.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
