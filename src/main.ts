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

// ✅ Thêm loading state khi chuyển route (không cần prefetch)
router.beforeEach((to, from, next) => {
  document.body.classList.add('router-loading')
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    document.body.classList.remove('router-loading')
  }, 150)
})

app.mount('#app')