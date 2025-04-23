import './assets/main.css'
import router from "@/router/index.js";
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('pz_token')

    if (!token && to.path !== '/login') {
        next('/login')  // 重定向到登录页
    }
    else if (token && to.path === '/login') {
        next('/')  // 已登录时访问登录页则重定向到首页
    }
    else {
        next()  // 其他情况放行
    }
})
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
