import { ref } from 'vue'
import { type Settings } from './useSettings'

const presets = ref<Partial<Settings>[]>([])

export async function loadPresets() {
  presets.value = await window.ipcRenderer.invoke('presets:get')
}

// export async function savePreset(preset: Settings) {
//   await window.ipcRenderer.invoke('presets:create', preset)
// }
export async function savePreset(preset: Settings) {
  const { language, ...presetWithoutLanguage } = preset
  await window.ipcRenderer.invoke('presets:create', presetWithoutLanguage)
}

loadPresets()

export async function deletePreset(preset: Settings) {
  await window.ipcRenderer.invoke('presets:delete', preset)
  await loadPresets()
}

export async function openFolder() {
  await window.ipcRenderer.invoke('presets:open')
}

export function usePresets() {
  return {
    presets,
    loadPresets,
    savePreset,
    deletePreset,
    openFolder
  }
}
