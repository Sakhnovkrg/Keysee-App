<script setup lang="ts">
import { ref, onMounted, watchEffect, computed, onBeforeUnmount, watch } from 'vue'
import { Settings, defaultSettings, useSettings } from '../composables/useSettings'
import { usePresets } from '../composables/usePresets'
import { ElMessage } from 'element-plus'
import SettingsPresets from './SettingsPresets.vue'
import { useI18n } from '../composables/useI18n'
const { t, locale, systemLocale } = useI18n()

const { settings, loadSettings } = useSettings()
const { presets, loadPresets, savePreset, deletePreset } = usePresets()

const isLoaded = ref(false)
const originalSettings = ref<Settings | null>(null)

const fontSize = ref(0)
const keyBorderRadius = ref(0)
const overlayBorderRadius = ref(0)
const keyBackgroundTransparency = ref(0)
const overlayTransparency = ref(0)
const overlayBottomOffset = ref(0)
const overlaySideOffset = ref(0)
const rippleSize = ref(0)
const rippleDuration = ref(0)
const rippleDisabled = computed(() => !settings.value?.rippleEnabled)
const selectedLocale = ref(locale.value)

const localeOptions: Record<string, string> = {
  'en-US': 'English',
  'ru-RU': 'Русский'
}

watch(selectedLocale, (newLocale) => {
  if (settings.value) {
    settings.value.language = newLocale
  }
})

watchEffect(() => {
  if (!settings.value) return

  fontSize.value = parseInt(settings.value.fontSize)
  keyBorderRadius.value = parseInt(settings.value.keyBorderRadius)
  overlayBorderRadius.value = parseInt(settings.value.overlayBorderRadius)
  keyBackgroundTransparency.value = parseInt(settings.value.keyBackgroundTransparency)
  overlayTransparency.value = parseInt(settings.value.overlayTransparency)
  overlayBottomOffset.value = parseInt(settings.value.overlayBottomOffset)
  overlaySideOffset.value = parseInt(settings.value.overlaySideOffset)
  rippleSize.value = parseInt(settings.value.rippleSize)
  rippleDuration.value = parseInt(settings.value.rippleDuration)
})

watchEffect(() => {
  if (!settings.value) return

  settings.value.fontSize = `${fontSize.value}px`
  settings.value.keyBorderRadius = `${keyBorderRadius.value}px`
  settings.value.overlayBorderRadius = `${overlayBorderRadius.value}px`
  settings.value.keyBackgroundTransparency = `${keyBackgroundTransparency.value}%`
  settings.value.overlayTransparency = `${overlayTransparency.value}%`
  settings.value.overlayBottomOffset = `${overlayBottomOffset.value}px`
  settings.value.overlaySideOffset = `${overlaySideOffset.value}px`
  settings.value.rippleSize = `${rippleSize.value}px`
  settings.value.rippleDuration = `${rippleDuration.value}ms`
})

function compareByDefaults(current: Partial<Settings>, defaults: Settings): boolean {
  const keys = Object.keys(defaults) as (keyof Settings)[]
  return keys.every(key => JSON.stringify(current[key]) === JSON.stringify(defaults[key]))
}

const applyDisabled = computed(() => {
  if (!settings.value || !originalSettings.value) return true
  return JSON.stringify(settings.value) === JSON.stringify(originalSettings.value)
})

const restoreDisabled = computed(() => {
  if (!isLoaded.value || !settings.value) return true
  return compareByDefaults(settings.value, defaultSettings)
})

function getPlainSettings(): Settings {
  return JSON.parse(JSON.stringify(settings.value))
}

function showSuccess(message = t('settings.updated')) {
  ElMessage({ message, grouping: true, type: 'success', duration: 1000 })
}

function createPreset(name: string) {
  const pres = getPlainSettings()
  savePreset({...pres, name: name})
  showSuccess(t('settings.created'))
  loadPresets()
}

async function removePreset(pres: Settings) {
  await deletePreset(pres)
  showSuccess(t('settings.deleted'))
}

async function setPreset (pres: string) {
  window.ipcRenderer.invoke('settings:update', JSON.parse(pres))
  await loadSettings()
}

function saveSettings() {
  window.ipcRenderer.invoke('settings:update', getPlainSettings())
  originalSettings.value = getPlainSettings()
  locale.value = selectedLocale.value
  showSuccess()
}

function handleSaveShortcut(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault()
    if (!applyDisabled.value) {
      saveSettings()
    }
  }
}

onMounted(async () => {
  window.postMessage({ payload: 'removeLoading' })

  await loadSettings()
  await loadPresets()
  originalSettings.value = getPlainSettings()
  isLoaded.value = true

  window.addEventListener('keydown', handleSaveShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSaveShortcut)
})

</script>

<template>
  <div v-if="settings" class="settings-screen">
    <div class="settings-group">
      <h2>{{ t('settings.generalSettings.groupTitle') }}</h2>
      <div class="settings-grid">
        <h3>{{ t('settings.generalSettings.language') }}</h3>
        <div class="settings-item">
          <el-select filterable v-model="selectedLocale" :placeholder="t('settings.generalSettings.languagePlaceholder')">
            <el-option v-for="(label, code) in localeOptions" :key="code" :label="label" :value="code" />
          </el-select>
        </div>
      </div>
      <SettingsPresets :presets="[...presets]" :default="defaultSettings" @create="createPreset" @set="setPreset" @delete="removePreset" />
    </div>

    <div class="settings-group">
      <h2>{{ t('settings.overlay.groupTitle') }}</h2>

      <div class="settings-grid">
        <h3>{{ t('settings.overlay.backgroundColor') }}</h3>
        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.overlayBackground]" v-model="settings.overlayBackground" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.general.backgroundTransparency') }}</h3>
        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}%`"
            @dblclick="overlayTransparency = parseInt(defaultSettings.overlayTransparency)"
            v-model="overlayTransparency" :min="0" :max="100" :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.general.borderRadius') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}px`"
            @dblclick="overlayBorderRadius = parseInt(defaultSettings.overlayBorderRadius)"
            v-model="overlayBorderRadius" :min="0" :max="64" :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.overlay.position') }}</h3>

        <div class="settings-item">
          <el-radio-group v-model="settings.overlayPosition" size="large">
            <el-radio-button size="default" label="◀" value="left" :title="t('settings.overlay.positionLeft')" />
            <el-radio-button size="default" label="⦿" value="center" :title="t('settings.overlay.positionCenter')" />
            <el-radio-button size="default" label="▶" value="right" :title="t('settings.overlay.positionRight')" />
          </el-radio-group>
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.overlay.bottomOffset') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}px`"
            @dblclick="overlayBottomOffset = parseInt(defaultSettings.overlayBottomOffset)"
            v-model="overlayBottomOffset" :min="50" :max="600" :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.overlay.sideOffset') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}px`"
            @dblclick="overlaySideOffset = parseInt(defaultSettings.overlaySideOffset)" v-model="overlaySideOffset"
            :min="10" :max="600" :step="1" />
        </div>
      </div>
    </div>
    <div class="settings-group">
      <h2>{{ t('settings.input.groupTitle') }}</h2>

      <div class="settings-grid">
        <h3>{{ t('settings.input.font') }}</h3>

        <div class="settings-item">
          <el-input v-model="settings.fontFamily" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.input.fontSize') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}px`"
            @dblclick="fontSize = parseInt(defaultSettings.fontSize)" v-model="fontSize" :min="13" :max="48"
            :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.input.singleKey') }}</h3>

        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.singleKeyBgColor]" v-model="settings.singleKeyBgColor" />
          <span>{{ t('settings.general.backgroundColor') }}</span>
        </div>
        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.singleKeyTextColor]" v-model="settings.singleKeyTextColor" />
          <span>{{ t('settings.general.textColor') }}</span>
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.input.keyCombo') }}</h3>

        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.comboKeyBgColor]" v-model="settings.comboKeyBgColor" />
          <span>{{ t('settings.general.backgroundColor') }}</span>
        </div>
        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.comboKeyTextColor]" v-model="settings.comboKeyTextColor" />
          <span>{{ t('settings.general.textColor') }}</span>
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.input.mouse') }}</h3>

        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.mouseBgColor]" v-model="settings.mouseBgColor" />
          <span>{{ t('settings.general.backgroundColor') }}</span>
        </div>
        <div class="settings-item">
          <el-color-picker :predefine="[defaultSettings.mouseTextColor]" v-model="settings.mouseTextColor" />
          <span>{{ t('settings.general.textColor') }}</span>
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.general.backgroundTransparency') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}%`"
            @dblclick="keyBackgroundTransparency = parseInt(defaultSettings.keyBackgroundTransparency)"
            v-model="keyBackgroundTransparency" :min="0" :max="100" :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.general.borderRadius') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}px`"
            @dblclick="keyBorderRadius = parseInt(defaultSettings.keyBorderRadius)" v-model="keyBorderRadius" :min="0"
            :max="32" :step="1" />
        </div>
      </div>

      <div class="settings-grid">
        <h3>{{ t('settings.input.eventDisplayTime') }}</h3>

        <div class="settings-item">
          <el-slider :format-tooltip="(val: number) => `${val}ms`"
            @dblclick="settings.eventDisplayDuration = defaultSettings.eventDisplayDuration"
            v-model="settings.eventDisplayDuration" :min="500" :max="5000" :step="100" />
        </div>
      </div>
    </div>
    <div class="settings-group">
      <h2>{{ t('settings.ripples.groupTitle') }}</h2>

      <el-switch v-model="settings.rippleEnabled" />

      <div :class="{ disabled: rippleDisabled }">
        <div class="settings-grid">
          <h3>{{ t('settings.ripples.rippleSize') }}</h3>
          <div class="settings-item">
            <el-slider :format-tooltip="(val: number) => `${val}px`" :disabled="rippleDisabled"
              @dblclick="rippleSize = parseInt(defaultSettings.rippleSize)" v-model="rippleSize" :min="4" :max="64"
              :step="1" />
          </div>
        </div>

        <div class="settings-grid">
          <h3>{{ t('settings.ripples.rippleTransparency') }}</h3>
          <div class="settings-item">
            <el-slider :format-tooltip="(val: number) => Math.round(val * 100) + '%'" :disabled="rippleDisabled"
              @dblclick="settings.rippleTransparency = defaultSettings.rippleTransparency"
              v-model="settings.rippleTransparency" :min="0" :max="1" :step="0.01" />
          </div>
        </div>

        <div class="settings-grid">
          <h3>{{ t('settings.ripples.rippleDuration') }}</h3>
          <div class="settings-item">
            <el-slider :format-tooltip="(val: number) => `${val}ms`" :disabled="rippleDisabled"
              @dblclick="rippleDuration = parseInt(defaultSettings.rippleDuration)" v-model="rippleDuration" :min="300"
              :max="3000" :step="100" />
          </div>
        </div>

        <div class="settings-grid">
          <div class="settings-item">
            <el-color-picker :predefine="[defaultSettings.rippleColorLeft]" v-model="settings.rippleColorLeft"
              :disabled="rippleDisabled" />
            <span>{{ t('settings.ripples.leftButton') }}</span>
          </div>
          <div class="settings-item">
            <el-color-picker :predefine="[defaultSettings.rippleColorMiddle]" v-model="settings.rippleColorMiddle"
              :disabled="rippleDisabled" />
            <span>{{ t('settings.ripples.middleButton') }}</span>
          </div>
          <div class="settings-item">
            <el-color-picker :predefine="[defaultSettings.rippleColorRight]" v-model="settings.rippleColorRight"
              :disabled="rippleDisabled" />
            <span>{{ t('settings.ripples.rightButton') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="settings-footer">
    <el-button :disabled="applyDisabled" type="primary" @click="saveSettings">
      {{ t('settings.save') }} (Ctrl + S)
    </el-button>
  </div>
</template>

<style>
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

.settings-screen {
  overflow-x: hidden;
  overflow-y: auto;
  height: 620px;
  flex: 1;
  padding: 10px;
  padding-bottom: 0;
}

.settings-footer {
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: space-between;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
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

.el-color-dropdown__btns .el-button:nth-child(2) {
  display: none;
}

.settings-group {
  border: 1px solid #ccc;
  padding: 10px;
  padding-top: 15px;
  border-radius: 4px;
  position: relative;
  margin-bottom: 10px;
}

h2 {
  position: absolute;
  left: 5px;
  top: -10px;
  background: white;
  padding: 0 10px;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
  margin: 0;
  padding: 0 5px;
  font-size: 13px;
  font-weight: normal;
  color: #999;
}

.disabled {
  opacity: .6;
  pointer-events: none;
}
</style>
