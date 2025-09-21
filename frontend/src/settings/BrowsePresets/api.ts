import { IPreset } from "./types"


export async function getPresets(): Promise<IPreset[]> {
  const raw = await fetch('https://raw.githubusercontent.com/Sakhnovkrg/Keysee-App/presets/presets/index.json')
  const json = JSON.parse(await raw.text())
    console.log(json)
  return (json?.presets || []).map(el => {return {data: el.preset, meta: el.meta}})
}