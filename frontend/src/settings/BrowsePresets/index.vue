<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPresets } from './api'
import Preset from './Preset.vue'
import { useI18n } from 'vue-i18n'
import { IPreset } from './types'

const visible = defineModel<boolean>('visible')
const emit = defineEmits()

const { t } = useI18n()

const presets = ref([] as IPreset[])

onMounted(async () => {
  presets.value = await getPresets()
})

</script>

<template>
  <el-dialog v-model="visible" :title="t('settings.generalSettings.presets.browsePresets')" width="400px" top="50px">
    <div class="presets">
      <Preset v-for="preset in presets" :preset="preset" @apply="emit('set', preset.data)" />
    </div>
  </el-dialog>
</template>