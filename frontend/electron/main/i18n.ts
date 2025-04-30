import { app } from 'electron'
import store from './store';
import ru_RU from '../locales/ru-RU.json'
import en_US from '../locales/en-US.json'

export const messages = {
    'en-US': en_US,
    'ru-RU': ru_RU
}

export function t(lang: string, key: string, params?: Record<string, string | number>): string {
    const template = key.split('.').reduce((o, i) => o?.[i], messages[lang] || messages['en-US'])

    if (typeof template !== 'string') return key

    if (!params) return template

    return template.replace(/{(\w+)}/g, (_, k) => {
        return params[k] !== undefined ? String(params[k]) : `{${k}}`
    })
}

export function getSystemLocale(): string {
    const lang = app.getLocale()
    const region = app.getLocaleCountryCode()
    const locale = lang && region ? `${lang}-${region}` : 'en-US'

    return messages[locale] ? locale : 'en-US'
}

export function getUserLocale(): string {
    const preferred = store.get('language')
    if (preferred && preferred.trim() !== '') return preferred

    return getSystemLocale()
}
