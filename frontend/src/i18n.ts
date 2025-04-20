import { createI18n } from 'vue-i18n'
import en_US from './locales/en-US.json'
import ru_RU from './locales/ru-RU.json'

export function getLocaleFromQuery(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('locale') || 'en-US'
}

export function getSystemLocaleFromQuery(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('systemLocale') || 'en-US'
}

export const i18n = createI18n({
  legacy: false,
  locale: getLocaleFromQuery(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': en_US,
    'ru-RU': ru_RU
  }
}) as ReturnType<typeof createI18n> & {
  systemLocale: string
}

i18n.systemLocale = getSystemLocaleFromQuery()