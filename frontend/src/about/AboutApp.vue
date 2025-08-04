<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t, locale } = useI18n()

onMounted(async () => {
  window.postMessage({ payload: 'removeLoading' })

  window.ipcRenderer.on('settings-updated', async (_event, data) => {
    locale.value = data.language
  })
})
</script>
<template>
  <div class="about-container">
    <div class="header">
      <img style="width: 80px;" src="../assets/keysee.svg" class="logo" alt="Keysee logo" />
    </div>
    <div class="version">v1.2.0</div>

    <p>{{ t('about.wtf') }}</p>

    <div class="links">
      <a href="https://sakhnovkrg.github.io/Keysee-App/" target="_blank">{{ t('about.website') }}</a>
      <a href="https://github.com/Sakhnovkrg/Keysee-App" target="_blank">{{ t('about.github') }}</a>
      <a href="https://www.paypal.com/paypalme/sakhnovkrg">{{ t('about.donate') }}</a>
    </div>
  </div>
</template>
<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}

.about-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 10px;
  text-align: center;
}

.version {
  color: #aaa;
  font-size: 13px;
  margin-top: 5px;
  text-align: center;
}

.links {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.links a {
  color: #00aaee;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>
