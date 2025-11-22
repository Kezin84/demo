import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App)

app.use(createPinia())
app.use(router)

// ✅ Thêm loading state khi chuyển route
let isNavigating = false

router.beforeEach((to, from, next) => {
  if (!isNavigating) {
    isNavigating = true
    // Thêm class loading vào body
    document.body.classList.add('router-loading')
  }
  next()
})

router.afterEach(() => {
  // Bỏ loading sau khi route đã load xong
  setTimeout(() => {
    document.body.classList.remove('router-loading')
    isNavigating = false
  }, 200)
})

// ✅ Prefetch routes quan trọng
router.isReady().then(() => {
  const criticalRoutes = [
    '/dashboard',
    '/quan-ly-hang-hoa',
    '/hoa-don-ban-hang',
    '/so-thu-chi'
  ]
  
  router.getRoutes().forEach(route => {
    if (criticalRoutes.includes(route.path) && route.component && typeof route.component === 'function') {
      route.component()
    }
  })
})

app.mount('#app')