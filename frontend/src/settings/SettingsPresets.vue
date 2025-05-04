<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { Settings } from '../composables/useSettings'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const emit = defineEmits()
const props = defineProps<{
  default: Settings,
  presets: Settings[],
  current?: Settings
}>()

const createdPreset = ref('')
const selectedPreset = ref() as Ref<string>
const createdPresetError = ref(false)
const createdPresetInput = ref(null)

const creating = ref(false)

const create = () => {
  creating.value = true
  createdPreset.value = JSON.parse(selectedPreset.value).name
  setTimeout(() => {
    createdPresetInput.value?.select()
  }, 330)
}

const confirm = () => {
  createdPresetError.value = false
  if (createdPreset.value.length) {
    emit('create', createdPreset.value)
    creating.value = false
  }
  else createdPresetError.value = true
}

const cancel = () => {
  createdPresetError.value = false
  creating.value = false
}

function select(pres: Settings) {
  emit('set', pres)
}

function deletePreset(preset: Settings) {
  emit('delete', JSON.parse(JSON.stringify(preset)))
  if (JSON.stringify(preset) == selectedPreset.value) {
    selectedPreset.value = JSON.stringify(props.default)
    emit('set', JSON.stringify(props.default))
  }
}

watch(props, () => {
  const findedPreset = props.presets.find(el => el.name == props.current)
  if (findedPreset) selectedPreset.value = JSON.stringify(findedPreset)
})

</script>

<template>
  <div class="settings-grid">
    <h3>{{ t('settings.generalSettings.presetName') }}</h3>
    <div :class="['settings-item', 'presets', creating ? 'creating' : 'selecting']">
      <el-select v-model="selectedPreset" class="presets__select" @change="select" :placeholder="t('settings.generalSettings.presetSelectPlaceholder')" :no-data-text="t('settings.noData')">
        <el-option v-for="preset in [props.default, ...props.presets]" :key="JSON.stringify(preset)" :label="preset.name || 'Default'" :value="JSON.stringify(preset)">
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>{{ preset.name || 'Default' }}</span>
          <el-popconfirm :confirmButtonText="t('ui.popconfirm.confirm')" :cancelButtonText="t('ui.popconfirm.cancel')"
            @confirm="deletePreset(preset)" :title="t('settings.generalSettings.presetDelete')">
            <template #reference v-if="preset.name">
              <el-icon :size="14" style="margin-right: -1em; margin-left: 1em" :title="t('settings.generalSettings.presetDelete')" @click.stop="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-d2e47025=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"></path></svg>
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
        </el-option>
      </el-select>
      <el-input v-model="createdPreset" @keyup.enter="confirm" ref="createdPresetInput" class="presets__create" :class="{ 'is-invalid': createdPresetError && !createdPreset.length }" :placeholder="t('settings.generalSettings.presetInputPlaceholder')" tabindex="-1" />
    </div>
    <div class="settings-item" v-show="creating">
      <el-icon @click="confirm" :size="13" style="cursor: pointer" :title="t('settings.generalSettings.presetAccept')">
        <svg :style="!createdPreset.length && {'pointer-events': none}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="black"/>
        </svg>
      </el-icon>
      <el-icon @click="cancel" :size="13" style="cursor: pointer" :title="t('settings.generalSettings.presetCancel')">
        <svg :style="!createdPreset.length && {'pointer-events': none}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-d2e47025=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
      </el-icon>
    </div>
    <div class="settings-item" v-show="!creating">
      <el-icon @click="create" :size="20" style="cursor: pointer" :title="t('settings.generalSettings.presetCreate')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.2 3C15.7275 3.00751 16.2307 3.22317 16.6 3.6L20.4 7.4C20.7768 7.76926 20.9925 8.27246 21 8.8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H15.2Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M7 3V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8H15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
::v-deep(.presets__create .el-input__wrapper) {
  border: 1px solid transparent;
  transition: border 0.2s ease;
}
::v-deep(.presets__create.is-invalid .el-input__wrapper) {
  box-shadow: unset;
  border: 1px solid red;
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
