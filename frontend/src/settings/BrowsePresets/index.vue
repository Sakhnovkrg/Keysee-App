<script setup lang="ts">
import Preset from './Preset.vue'
import { useI18n } from 'vue-i18n'

const visible = defineModel<boolean>('visible')
const emit = defineEmits()

const { t } = useI18n()

const presets = [
  { "title": 'Lorem ipsum 1', "overlayBackground": "#C5DA08", "overlayTransparency": "50%", "overlayBorderRadius": "64px", "overlayBottomOffset": "50px", "overlaySideOffset": "15px", "overlayPosition": "center", "singleKeyBgColor": "#FFFFFF", "singleKeyTextColor": "#9A0DB9", "comboKeyBgColor": "#00FF88", "comboKeyTextColor": "#1A8D91", "mouseBgColor": "#FFC800", "mouseTextColor": "#F31717", "fontSize": "48px", "keyBorderRadius": "20px", "keyBackgroundTransparency": "86%", "fontFamily": "Segoe UI", "eventDisplayDuration": 1800, "maxSingleKeys": 1, "rippleEnabled": true, "rippleSize": "62px", "rippleTransparency": 0.59, "rippleDuration": "1100ms", "rippleColorLeft": "#0DE002", "rippleColorMiddle": "#000000", "rippleColorRight": "#320AE3", "name": "1" },
  { "title": 'Lorem ipsum 2', "overlayBackground": "#5631BC", "overlayTransparency": "50%", "overlayBorderRadius": "64px", "overlayBottomOffset": "50px", "overlaySideOffset": "15px", "overlayPosition": "center", "singleKeyBgColor": "#000000", "singleKeyTextColor": "#22DBB6", "comboKeyBgColor": "#29313F", "comboKeyTextColor": "#1A912A", "mouseBgColor": "#EF9750", "mouseTextColor": "#088C41", "fontSize": "13px", "keyBorderRadius": "0px", "keyBackgroundTransparency": "25%", "fontFamily": "Arial", "eventDisplayDuration": 1800, "maxSingleKeys": 1, "rippleEnabled": true, "rippleSize": "10px", "rippleTransparency": 0.27, "rippleDuration": "1100ms", "rippleColorLeft": "#A18815", "rippleColorMiddle": "#123870", "rippleColorRight": "#522468", "name": "2" },
]

presets.forEach(el => {

})

</script>

<template>
  <el-dialog v-model="visible" :title="t('settings.generalSettings.presets.browsePresets')" width="400px" top="50px">
    <div class="presets">
      <Preset v-for="preset in presets" :preset="preset" @apply="emit('set', preset)" />
    </div>
  </el-dialog>
</template>