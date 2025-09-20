<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { Settings } from '../composables/useSettings'
import BrowsePresets from './BrowsePresets/index.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const emit = defineEmits()
const props = defineProps<{
  presets: Settings[],
  current?: string,
  editing?: boolean
}>()

const createdPreset = ref('')
const selectedPreset = ref() as Ref<string|undefined>
const createdPresetError = ref(false)
const createdPresetInput = ref() as Ref<HTMLInputElement>

const creating = ref(false)

const create = () => {
  creating.value = true
  if (selectedPreset.value) createdPreset.value = JSON.parse(selectedPreset.value).name
  setTimeout(() => {
    createdPresetInput.value[createdPreset.value?.length ? 'select' : 'focus']()
  }, 350)
}

const restore = () => {
  selectedPreset.value = undefined
  emit('restore')
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

const presetsBrowseVisible = ref(false)
function browse() {
  presetsBrowseVisible.value = true
}

function deletePreset(preset: Settings) {
  emit('delete', JSON.parse(JSON.stringify(preset)))
  if (JSON.stringify(preset) == selectedPreset.value) {
    restore()
  }
}

function openFolder() {
  emit('open')
}

watch(props, () => {
  const findedPreset = props.presets.find(el => el.name == props.current)
  if (findedPreset) selectedPreset.value = JSON.stringify(findedPreset)
})

</script>

<template>
<div class="settings-grid">
    <h3>
      {{ t('settings.generalSettings.presets.presetName') }} &nbsp;
      <el-icon @click="openFolder" :size="15" style="cursor: pointer" :title="t('settings.generalSettings.presets.presetOpen')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-d2e47025=""><path fill="currentColor" d="M128 384v448h768V384zm-32-64h832a32 32 0 0 1 32 32v512a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V352a32 32 0 0 1 32-32m64-128h704v64H160zm96-128h512v64H256z"></path></svg>
      </el-icon>
    </h3>
    <div :class="['settings-item', 'presets', creating ? 'creating' : 'selecting']">
      <el-select v-model="selectedPreset" class="presets__select" @change="select" :placeholder="t('settings.generalSettings.presets.presetSelectPlaceholder')" :no-data-text="t('settings.noData')">
        <template #label="{ label, value }">
          <div style="display: flex"><div style="overflow: hidden; text-overflow: ellipsis; max-width: 92%; margin-right: 4px">{{ label }}</div><span :class="['editing', (editing) && 'visible']">*</span></div>
        </template>
        <el-option v-for="preset in presets" :key="JSON.stringify(preset)" :label="preset.name" :value="JSON.stringify(preset)">
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>{{ preset.name }}<span :class="['editing', (editing && preset.name == current) && 'visible']"> *</span></span>
          <el-popconfirm :confirmButtonText="t('ui.popconfirm.confirm')" :cancelButtonText="t('ui.popconfirm.cancel')"
            @confirm="deletePreset(preset)" :title="t('settings.generalSettings.presets.presetDelete')">
            <template #reference v-if="preset.name">
              <el-icon :size="14" style="margin-right: -1em; margin-left: 1em" :title="t('settings.generalSettings.presets.presetDelete')" @click.stop="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-d2e47025=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"></path></svg>
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
        </el-option>
      </el-select>
      <el-input v-model="createdPreset" @keyup.enter="confirm" ref="createdPresetInput" class="presets__create" :class="{ 'is-invalid': createdPresetError && !createdPreset.length }" :placeholder="t('settings.generalSettings.presets.presetInputPlaceholder')" tabindex="-1" />
    </div>
    <div class="settings-item" v-show="creating">
      <el-icon @click="confirm" :size="13" style="cursor: pointer" :title="t('settings.generalSettings.presets.presetAccept')">
        <svg :style="!createdPreset.length && {'pointer-events': none}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="black"/>
        </svg>
      </el-icon>
      <el-icon @click="cancel" :size="13" style="cursor: pointer" :title="t('settings.generalSettings.presets.presetCancel')">
        <svg :style="!createdPreset.length && {'pointer-events': none}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-d2e47025=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
      </el-icon>
    </div>
    <div class="settings-item" v-show="!creating">
      <el-icon @click="create" :size="20" style="cursor: pointer" :title="t('settings.generalSettings.presets.presetCreate')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.2 3C15.7275 3.00751 16.2307 3.22317 16.6 3.6L20.4 7.4C20.7768 7.76926 20.9925 8.27246 21 8.8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H15.2Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M7 3V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8H15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </el-icon>
      <el-icon @click="restore" :size="18" style="cursor: pointer" :title="t('settings.restoreDefaults')">
        <svg focusable="false" data-icon="rollback" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M793 242H366v-74c0-6.7-7.7-10.4-12.9-6.3l-142 112a8 8 0 000 12.6l142 112c5.2 4.1 12.9.4 12.9-6.3v-74h415v470H175c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-28.7 64-64V306c0-35.3-28.7-64-64-64z"></path></svg>
      </el-icon>
      <el-icon @click="browse" :size="18" style="cursor: pointer; margin-left: 1rem;" :title="t('settings.generalSettings.presets.browsePresets')">
        <svg focusable="false" data-icon="rollback" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8-1.1-1.3-2.1-2.5-3.2-3.7-.4-.5-.8-.9-1.2-1.4l-4.1-4.7-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1-4.8-4.8-.3-.3c-1.5-1.5-3-2.9-4.5-4.3-.5-.5-1-1-1.6-1.5-1-1-2-1.9-3-2.8-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1-1 .9-2 1.9-3 2.9-.5.5-1 1-1.6 1.5-1.5 1.4-3 2.9-4.5 4.3l-.3.3-4.8 4.8-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7-.4.5-.8.9-1.2 1.4-1.1 1.2-2.1 2.5-3.2 3.7-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2 1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6 80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0010-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5 0-.1.1-.1.1-.2 1.4-1.5 2.8-3.1 4.1-4.7.4-.5.8-.9 1.2-1.4a99 99 0 003.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 00-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6 29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 01887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 01-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4 3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 01115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 01540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4 21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 00540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4-21.2-16.7-41.7-42.7-59.1-75.1-11-20.6-20.7-43.3-29-67.8 37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 01-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8 17.4-32.4 37.8-58.4 59.1-75.1 9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4-23.4 31.3-43.5 70.4-59.2 115.4-21-12-40.9-26-59.4-41.8 31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2 24.9 21.5 52.2 40.3 81.5 55.9-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 00-81.5 55.9A373.86 373.86 0 01137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2 18.5-15.8 38.4-29.7 59.4-41.8 15.7 45 35.8 84.1 59.2 115.4-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4 23.4-31.3 43.5-70.4 59.2-115.4 21 12 40.9 26 59.4 41.8a373.81 373.81 0 01-107.6 69.2z"></path></svg>
      </el-icon>
      <BrowsePresets v-model:visible="presetsBrowseVisible" @set="(preset: Settings) => emit('apply', preset)" />
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

.editing {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.editing.visible {
  opacity: 1;
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
