<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { Settings } from '../../composables/useSettings'
import { useCssVars } from '../../composables/useCssVars'
import '../../style.css'
import { getPresets } from './api'

const visible = defineModel<boolean>('visible')
const emit = defineEmits()
const props = defineProps<{
  preset: Partial<Settings>,
}>()

const { applyFromSettings } = useCssVars()

const root = ref() as Ref<HTMLElement>;

onMounted(() => {
  applyFromSettings({ ...props.preset, fontSize: '16px' }, root.value)
})

</script>

<template>
  <div class="preset">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div><strong>{{ preset.name }}</strong> (Testing)</div>
      <div class="preset__tags">
        <el-tag size="small" :color="preset.singleKeyBgColor">School</el-tag>
        <el-tag size="small" :color="preset.singleKeyBgColor">qweqw</el-tag>
      </div>
    </div>
    <div class="preset__items" ref="root">
      <div class="preset__items__keys">
        <transition name="wrapper-fade">
          <transition-group name="fade" tag="div" class="events">
            <div class="event-wrapper">
              <div class="event key-event" style="user-select: none;">
                Backspace
              </div>
            </div>
          </transition-group>
        </transition>
        <transition name="wrapper-fade">
          <transition-group name="fade" tag="div" class="events">
            <div class="event-wrapper">
              <div class="event combo-event" style="user-select: none;">
                Ctrl + C x3
              </div>
            </div>
          </transition-group>
        </transition>
        <transition name="wrapper-fade">
          <transition-group name="fade" tag="div" class="events">
            <div class="event-wrapper">
              <div class="event mouse-event" style="user-select: none;">
                Ctrl + 🡇 Scroll x6
              </div>
            </div>
          </transition-group>
        </transition>
      </div>
      <svg viewBox="0 0 120 160" width="70" height="100" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40
                a40 40 0 0 1 80 0
                v50
                a40 40 0 0 1 -80 0
                z" fill="white" stroke="black" stroke-width="6" />
        <path d="M20 40
                a40 40 0 0 1 40 -40
                v60
                h-40
                z" fill="var(--ripple-left, white)" stroke="black" stroke-width="4" />
        <path d="M100 40
                a40 40 0 0 0 -40 -40
                v60
                h40
                z" fill="var(--ripple-right, white)" stroke="black" stroke-width="4" />
        <rect x="52" y="20" width="16" height="40" rx="6" fill="var(--ripple-middle, white)" stroke="black"
          stroke-width="4" />
      </svg>
    </div>
    <el-divider />
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <el-button :color="preset.overlayBackground" :style="{ color: preset.singleKeyTextColor, fontWeight: 600 }"
        @click="emit('apply')">{{ $t('settings.generalSettings.presets.apply') }}</el-button>
      <div>by <strong>gssfasasfd</strong></div>
    </div>
  </div>
</template>

<style scoped>
.ripple {
  --ripple-duration: 99999ms;
  --ripple-size: 16px
}

.preset {
  border: 1px solid rgba(0, 0, 0, 0.132);
  border-radius: 4px;
  padding: 1em;
  margin-bottom: 1em;
  transition: background 0.1s ease;

  &:hover {
    background: rgba(148, 148, 148, 0.132);
    ;
  }
}

.preset__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}

.preset__items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  margin-top: 1em;
}
.preset__items__keys {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
}
</style>