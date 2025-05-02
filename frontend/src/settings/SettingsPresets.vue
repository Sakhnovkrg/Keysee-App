<script setup lang="ts">
import { ref } from 'vue'
import { Settings } from '../composables/useSettings'
import { Delete } from '@element-plus/icons-vue'
import { useI18n } from '../composables/useI18n'
const { t } = useI18n()

const emit = defineEmits()
const props = defineProps<{
  default: Settings,
  presets: Settings[],
}>()

const createdPreset = ref('')
const selectedPreset = ref()
const createdPresetError = ref(false)
const createdPresetInput = ref(null)

const creating = ref(false)

const create = () => {
  createdPresetError.value = false
  if (creating.value) {
    if (createdPreset.value.length) {
      emit('create', createdPreset.value)
      creating.value = false
      setTimeout(() => {
        const newPreset = (props.presets || []).find(el => el.name == createdPreset.value)
        if (newPreset) selectedPreset.value = JSON.stringify(newPreset)
        createdPreset.value = ''
      }, 100)
    }
    else createdPresetError.value = true
  }
  else {
    creating.value = true
    setTimeout(() => {
      createdPresetInput.value?.focus()
    }, 300)
  }
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
                <Delete />
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
        </el-option>
      </el-select>
      <el-input v-model="createdPreset" @keyup.enter="create" ref="createdPresetInput" class="presets__create" :class="{ 'is-invalid': createdPresetError && !createdPreset.length }" :placeholder="t('settings.generalSettings.presetInputPlaceholder')" tabindex="-1" />
    </div>
    <div class="settings-item">
      <el-icon :size="creating ? 13 : 20" style="cursor: pointer" :title="t(`settings.generalSettings.preset${creating ? 'Accept' : 'Create'}`)" @click="create">
        <div v-if="creating">
          <svg :style="!createdPreset.length && {'pointer-events': none}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.54998 18.0001L3.84998 12.3001L5.27498 10.8751L9.54998 15.1501L18.725 5.9751L20.15 7.4001L9.54998 18.0001Z" fill="black"/>
          </svg>
        </div>
        <div v-else>
          <svg v-show="!creating" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.586 2C14.0556 2.00011 14.5101 2.16543 14.87 2.467L15 2.586L19.414 7C19.746 7.33202 19.9506 7.77028 19.992 8.238L20 8.414V20C20.0002 20.5046 19.8096 20.9906 19.4665 21.3605C19.1234 21.7305 18.6532 21.9572 18.15 21.995L18 22H6C5.49542 22.0002 5.00943 21.8096 4.63945 21.4665C4.26947 21.1234 4.04284 20.6532 4.005 20.15L4 20V4C3.99984 3.49542 4.19041 3.00943 4.5335 2.63945C4.87659 2.26947 5.34684 2.04284 5.85 2.005L6 2H13.586ZM12 4H6V20H18V10H13.5C13.1022 10 12.7206 9.84196 12.4393 9.56066C12.158 9.27936 12 8.89782 12 8.5V4ZM12 11.5C12.2652 11.5 12.5196 11.6054 12.7071 11.7929C12.8946 11.9804 13 12.2348 13 12.5V14H14.5C14.7652 14 15.0196 14.1054 15.2071 14.2929C15.3946 14.4804 15.5 14.7348 15.5 15C15.5 15.2652 15.3946 15.5196 15.2071 15.7071C15.0196 15.8946 14.7652 16 14.5 16H13V17.5C13 17.7652 12.8946 18.0196 12.7071 18.2071C12.5196 18.3946 12.2652 18.5 12 18.5C11.7348 18.5 11.4804 18.3946 11.2929 18.2071C11.1054 18.0196 11 17.7652 11 17.5V16H9.5C9.23478 16 8.98043 15.8946 8.79289 15.7071C8.60536 15.5196 8.5 15.2652 8.5 15C8.5 14.7348 8.60536 14.4804 8.79289 14.2929C8.98043 14.1054 9.23478 14 9.5 14H11V12.5C11 12.2348 11.1054 11.9804 11.2929 11.7929C11.4804 11.6054 11.7348 11.5 12 11.5ZM14 4.414V8H17.586L14 4.414Z" fill="black"/>
          </svg>
        </div>
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
