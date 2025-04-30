<script setup lang="ts">
import { ref } from 'vue'
import { Settings } from '../composables/useSettings'
import { DocumentAdd, Select, Delete } from '@element-plus/icons-vue'
import { useI18n } from '../composables/useI18n'
const { t } = useI18n()

const emit = defineEmits()
const props = defineProps<{
    presets?: Partial<Settings>[],
}>()

const createdPreset = ref('')
const selectedPreset = ref(null)

const creating = ref(false)

const create = () => {
  if (creating.value) {
    emit('create', createdPreset.value)
    creating.value = false
  }
  else {
    creating.value = true
  }
}

function select(pres: Partial<Settings>) {
  emit('set', pres)
}

function deletePreset(preset: Partial<Settings>) {
  emit('delete', JSON.parse(JSON.stringify(preset)))
}

</script>

<template>
  <div class="settings-grid">
    <h3>{{ t('settings.generalSettings.presetName') }}</h3>
    <div :class="['settings-item', 'presets', creating ? 'creating' : 'selecting']">
      <el-select v-model="selectedPreset" class="presets__select" @change="select" :placeholder="t('settings.generalSettings.presetSelectPlaceholder')">
        <el-option v-for="preset in props.presets" :key="JSON.stringify(preset)" :label="preset.name || '-'" :value="JSON.stringify(preset)">
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>{{ preset.name || '-' }}</span>
          <el-popconfirm :confirmButtonText="t('ui.popconfirm.confirm')" :cancelButtonText="t('ui.popconfirm.cancel')"
            @confirm="deletePreset(preset)" :title="t('settings.generalSettings.presetDelete')">
            <template #reference>
              <el-icon :size="14" style="margin-right: -1em; margin-left: 1em" :title="t('settings.generalSettings.presetDelete')" @click.stop="">
                <Delete />
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
        </el-option>
      </el-select>
      <el-input v-model="createdPreset" class="presets__create" :placeholder="t('settings.generalSettings.presetInputPlaceholder')" />
    </div>
    <div class="settings-item">
      <el-icon :size="creating ? 13 : 20" style="cursor: pointer" :title="t(`settings.generalSettings.preset${creating ? 'Accept' : 'Create'}`)" @click="create">
        <Select v-if="creating" />
        <DocumentAdd v-else />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0;
  font-size: 13px;
  line-height: 1;
  overflow-x: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.presets {
  position: relative;
  flex-wrap: nowrap;
  overflow: hidden;
  width: fit-content;
}

.presets .presets__select, .presets .presets__create {
  min-width: 100%;
  transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
}
.presets.creating .presets__create {
  transform: translateX(calc(-100% - 10px));
  pointer-events: auto;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px
}

h3 {
  margin: 0;
  margin-bottom: 5px;
  font-size: 13px;
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>
