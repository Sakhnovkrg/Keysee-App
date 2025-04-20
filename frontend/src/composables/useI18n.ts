import { useI18n as useVueI18n } from 'vue-i18n'
import { i18n } from '../i18n'

export function useI18n() {
  const base = useVueI18n()
  return {
    ...base,
    systemLocale: i18n.systemLocale
  }
}
