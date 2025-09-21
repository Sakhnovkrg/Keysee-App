import { Settings } from "../../composables/useSettings"

export async function getPresets() {
  const raw = await fetch('https://raw.githubusercontent.com/Sakhnovkrg/Keysee-App/presets/presets/index.json')
  const json = await raw.json()
  
  
}