import { ref } from 'vue'
import {
  eventKey,
  isModifierKey,
  hasAnyModifiers,
  formatWithModifiers,
} from './useEventUtils'

export interface Modifiers {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  win?: boolean
}

export interface InputEvent {
  id: number
  type: string
  key?: string
  btn?: string
  direction?: string
  modifiers?: Modifiers
  count?: number
}

interface Options {
  displayDuration: number
  onPulse: (id: number) => void
}

export function useEventManager({ displayDuration, onPulse }: Options) {
  const events = ref<InputEvent[]>([])
  let counter = 0
  let lastSingleKeyId: number | null = null
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  function format(e: InputEvent): string {
    return formatWithModifiers(e)
  }

  function scheduleCleanup(id: number) {
    clearTimeout(timers.get(id))
    const timeout = setTimeout(() => {
      events.value = events.value.filter((e) => e.id !== id)
      timers.delete(id)
      if (lastSingleKeyId === id) lastSingleKeyId = null
    }, displayDuration)
    timers.set(id, timeout)
  }

  function handle(raw: Omit<InputEvent, 'id'>) {
    const key = eventKey(raw)

    if (
      raw.type === 'mouseup' ||
      (raw.type === 'wheel' && !hasAnyModifiers(raw.modifiers)) ||
      (raw.type === 'mousedown' && !hasAnyModifiers(raw.modifiers)) ||
      (raw.type === 'keyboard' && isModifierKey(raw.key))
    ) return

    const last = events.value[events.value.length - 1]
    const isSingle = raw.type === 'keyboard' && !hasAnyModifiers(raw.modifiers)

    if (
      isSingle &&
      last &&
      last.id === lastSingleKeyId
    ) {
      if (last.key === raw.key) {
        last.count = (last.count || 1) + 1
      } else {
        last.key = raw.key
        last.count = 1
      }
      onPulse(last.id)
      scheduleCleanup(last.id)
      return
    }

    if (
      last &&
      eventKey(last) === key &&
      last.type === raw.type &&
      !isSingle
    ) {
      last.count = (last.count || 1) + 1
      onPulse(last.id)
      scheduleCleanup(last.id)
      return
    }

    const item: InputEvent = { ...raw, id: counter++, count: 1 }
    events.value.push(item)
    onPulse(item.id)
    scheduleCleanup(item.id)

    lastSingleKeyId = isSingle ? item.id : null
  }

  return {
    events,
    format,
    handle,
  }
}
