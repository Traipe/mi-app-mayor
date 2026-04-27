import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '../components/HomeScreen.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: HomeScreen,
  },
  {
    path: '/mensajes',
    name: 'mensajes',
    component: () => import('../components/Messages.vue'),
  },
  {
    path: '/fotos',
    name: 'fotos',
    component: () => import('../components/Photos.vue'),
  },
  {
    path: '/notas',
    name: 'notas',
    component: () => import('../components/Notes.vue'),
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: () => import('../components/Calendar.vue'),
  },
  {
    path: '/ayuda',
    name: 'ayuda',
    component: () => import('../components/HelpScreen.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router