import { type Settings } from "../../composables/useSettings"

export type IPreset = {
  data: IPresetData
  meta: IPresetMeta
}

type IPresetData = Settings

export type IPresetMeta = {
  author?: string
  description?: string
  category?: string
  tags?: string[]
}