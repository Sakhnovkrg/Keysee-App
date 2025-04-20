<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettings } from './composables/useSettings'
import { useRipple } from './composables/useRipple'
import { useEventManager } from './composables/useEventManager'
import { useCssVars } from './composables/useCssVars'

const { applyFromSettings } = useCssVars()
const { settings, loadSettings } = useSettings()
const { clickRipples, handleRipple } = useRipple()

const { events, format, handle } = useEventManager({
  displayDuration: settings.value?.eventDisplayDuration ?? 2000,
  onPulse(id) {
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-event-id="${id}"]`)
      if (el) {
        el.classList.remove('pulse')
        void (el as HTMLElement).offsetWidth
        el.classList.add('pulse')
      }
    })
  }
})

onMounted(async () => {
  window.ipcRenderer.onInputEvent((data) => {
    if (data.type === 'mousedown' && settings.value?.rippleEnabled) {
      handleRipple(data, parseInt(settings.value.rippleDuration ?? '600'))
    }
    handle(data)
  })

  window.ipcRenderer.on('settings-updated', async (_event, data) => {
    await loadSettings()
    applyFromSettings(data)
  })

  await loadSettings()
  if (settings.value) applyFromSettings(settings.value)
})


function getEventClass(e: any): string {
  if (['dblclick', 'mousedown', 'mouseup', 'wheel'].includes(e.type)) return 'mouse-event'
  if (e.type === 'keyboard') return e.modifiers && Object.values(e.modifiers).some(Boolean) ? 'combo-event' : 'key-event'
  return ''
}
</script>

<template>
  <div class="ripples">
    <div v-for="r in clickRipples" :key="r.id" class="ripple" :class="`btn-${r.btn}`"
      :style="{ left: r.x + 'px', top: r.y + 'px' }"></div>
  </div>

  <div class="overlay">
    <transition name="wrapper-fade">
      <div v-if="events.length" class="events-wrapper">
        <transition-group name="fade" tag="div" class="events">
          <div v-for="e in events" :key="e.id" class="event-wrapper">
            <div class="event" :class="getEventClass(e)" :data-event-id="e.id">
              <template v-if="e.type === 'keyboard'">
                {{ format(e) }}
              </template>
              <template v-else-if="e.type === 'wheel'">
                {{ format(e) }}
              </template>
              <template v-else-if="e.type === 'mousedown'">
                {{ format(e) }}
              </template>
              <template v-if="e.count && e.count > 1">
                <small>&nbsp;x{{ e.count }}</small>
              </template>
            </div>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>
