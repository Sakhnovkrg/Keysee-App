import { createApp } from 'vue'
import AboutApp from './AboutApp.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { i18n } from '../i18n'

createApp(AboutApp).use(ElementPlus).use(i18n).mount('#app')
