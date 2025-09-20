<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { Settings } from '../../composables/useSettings'
import { useCssVars } from '../../composables/useCssVars'
import '../../style.css'

const visible = defineModel<boolean>('visible')
const emit = defineEmits()
const props = defineProps<{
  preset: Partial<Settings>,
}>()

const { applyFromSettings } = useCssVars()

const root = ref() as Ref<HTMLElement>;

onMounted(() => {
  applyFromSettings(props.preset, root.value)
})

</script>

<template>
  <div class="preset">
    <strong>{{ preset.name }}</strong>
    <div class="preset__items" ref="root">
      <transition name="wrapper-fade">
        <transition-group name="fade" tag="div" class="events">
          <div class="event-wrapper">
            <div class="event key-event" style="user-select: none;">
              Tab + F2
            </div>
          </div>
        </transition-group>
      </transition>
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
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <el-button :color="preset.overlayBackground"
        :style="{ color: preset.singleKeyTextColor, fontWeight: 600 }" @click="emit('apply')">{{ $t('settings.apply') }}</el-button>
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

.preset__items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  position: relative;
}
</style>