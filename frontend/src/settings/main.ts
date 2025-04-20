import { createApp } from 'vue'
import SettingsApp from './SettingsApp.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { i18n } from '../i18n'

createApp(SettingsApp).use(i18n).use(ElementPlus).mount('#app')