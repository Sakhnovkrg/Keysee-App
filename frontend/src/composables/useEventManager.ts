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
  maxSingleKeys: number
  maxTotalEvents: number // Новый параметр
  onPulse: (id: number) => void
}

export function useEventManager({ displayDuration, maxSingleKeys, maxTotalEvents, onPulse }: Options) {
  const events = ref<InputEvent[]>([])
  let counter = 0
  
  // Для старой логики (maxSingleKeys = 1)
  let lastSingleKeyId: number | null = null
  
  // Для новой логики (maxSingleKeys > 1)
  const singleKeyIds: number[] = []
  
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  function format(e: InputEvent): string {
    return formatWithModifiers(e)
  }

  function scheduleCleanup(id: number) {
    clearTimeout(timers.get(id))
    const timeout = setTimeout(() => {
      events.value = events.value.filter((e) => e.id !== id)
      timers.delete(id)
      
      // Очистка для старой логики
      if (lastSingleKeyId === id) lastSingleKeyId = null
      
      // Очистка для новой логики
      const index = singleKeyIds.indexOf(id)
      if (index > -1) singleKeyIds.splice(index, 1)
    }, displayDuration)
    timers.set(id, timeout)
  }

  function removeSingleKey(id: number) {
    events.value = events.value.filter((e) => e.id !== id)
    clearTimeout(timers.get(id))
    timers.delete(id)
    const index = singleKeyIds.indexOf(id)
    if (index > -1) singleKeyIds.splice(index, 1)
  }

  function removeOldestEvent() {
    if (events.value.length === 0) return
    
    const oldestEvent = events.value[0]
    removeSingleKey(oldestEvent.id)
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

    // Старая логика для maxSingleKeys = 1 (мгновенная замена)
    if (maxSingleKeys === 1 && isSingle && last && last.id === lastSingleKeyId) {
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

    // Новая логика для maxSingleKeys > 1
    if (maxSingleKeys > 1 && isSingle && singleKeyIds.length > 0) {
      const lastSingleKeyId = singleKeyIds[singleKeyIds.length - 1]
      const lastSingleEvent = events.value.find(e => e.id === lastSingleKeyId)
      
      if (lastSingleEvent && lastSingleEvent.key === raw.key) {
        lastSingleEvent.count = (lastSingleEvent.count || 1) + 1
        onPulse(lastSingleEvent.id)
        scheduleCleanup(lastSingleEvent.id)
        return
      }
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

    if (isSingle) {
      if (maxSingleKeys === 1) {
        // Старая логика
        lastSingleKeyId = item.id
      } else {
        // Новая логика
        singleKeyIds.push(item.id)
        
        if (singleKeyIds.length > maxSingleKeys) {
          const oldestId = singleKeyIds.shift()!
          removeSingleKey(oldestId)
        }
      }
    }

    // Ограничение на общее количество событий
    while (events.value.length > maxTotalEvents) {
      removeOldestEvent()
    }
  }

  return {
    events,
    format,
    handle,
  }
}