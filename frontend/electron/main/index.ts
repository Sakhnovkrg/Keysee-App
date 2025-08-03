import { app, BrowserWindow, shell, ipcMain, Tray, Menu, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { spawn } from 'child_process'
import store from './store'
import { createSettingsWindow } from './settings'
import { createAboutWindow } from './about'
import semver from 'semver'
import { ChildProcess } from 'node:child_process'
import { t, getUserLocale } from './i18n'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CURRENT_VERSION = app.getVersion()
let tray: Tray | null = null
let win: BrowserWindow | null = null
let backendProcess: ChildProcess | null = null
let locale: string | undefined = undefined

const APP_DATA_DIST = app.getPath('userData')
const APP_ROOT = path.join(__dirname, '../..')
const MAIN_DIST = path.join(APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(APP_ROOT, 'dist')
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST

process.env.APP_ROOT = APP_ROOT
process.env.VITE_PUBLIC = VITE_PUBLIC

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId('keysee-app')

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// IPC
ipcMain.handle('settings:get', () => store.store)
ipcMain.handle('settings:set', (_event, payload) => store.set(payload))
ipcMain.handle('settings:update', (_event, payload) => {
  store.set(payload)

  const newLang = payload.language?.trim() || getUserLocale()

  const oldSettingsTitle = t(locale, 'window.settings.title')
  const newSettingsTitle = t(newLang, 'window.settings.title')

  const oldAboutTitle = t(locale, 'window.about.title')
  const newAboutTitle = t(newLang, 'window.about.title')

  if (locale !== newLang) {
    const settingsWin = BrowserWindow.getAllWindows().find(win =>
      win.getTitle() === oldSettingsTitle
    )

    if (settingsWin) {
      settingsWin.setTitle(newSettingsTitle)
    }

    const aboutWin = BrowserWindow.getAllWindows().find(win =>
      win.getTitle() === oldAboutTitle
    )

    if (aboutWin) {
      aboutWin.setTitle(newAboutTitle)
    }

    locale = newLang
    updateTrayMenu()
  }

  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('settings-updated', payload)
  })
})

ipcMain.handle('presets:get', () => {
  const folderPath = path.join(APP_DATA_DIST, 'presets')
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  const files = fs.readdirSync(folderPath)

  const presets = []

  for (const file of files) {
    if (file.endsWith('.json')) {
        const filePath = path.join(folderPath, file);
        try {
            const preset = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            const name = file.split('.json')[0]
            if (name == 'settings') preset.name = 'Default'
            presets.push(preset)
        } catch (err) { }
    }
  }

  return presets
})
ipcMain.handle('presets:create', (_event, payload) => {
  const folderPath = path.join(APP_DATA_DIST, 'presets')

  const filePath = path.join(folderPath, `${payload.name}.json`)
  fs.writeFileSync(filePath, JSON.stringify(payload))
})
ipcMain.handle('presets:delete', (_event, payload) => {
  const folderPath = path.join(APP_DATA_DIST, 'presets')

  const filePath = path.join(folderPath, `${payload.name}.json`)
  fs.unlink(filePath, (err) => {
    console.log(err);
  })
})
ipcMain.handle('presets:open', () => {
  const folderPath = path.join(APP_DATA_DIST, 'presets')
  shell.openPath(folderPath)
})

// Window
async function createWindow() {
  win = new BrowserWindow({
    frame: false,
    transparent: true,
    fullscreen: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    alwaysOnTop: true,
    icon: path.join(process.resourcesPath, 'assets', 'icon.ico'),
    title: 'Keysee',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true, 'screen-saver')
  // win.webContents.openDevTools()

  if (VITE_DEV_SERVER_URL) {
    await win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    await win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function updateTrayMenu() {
  if (!tray) return;
  const menu = Menu.buildFromTemplate([
    { label: t(locale, 'tray.settings'), click: createSettingsWindow },
    { label: t(locale, 'tray.about'), click: createAboutWindow },
    { type: 'separator' },
    {
      label: t(locale, 'tray.off'),
      type: 'checkbox',
      checked: true,
      click: (menuItem) => {
        if (menuItem.checked) launchBackend()
        else cleanupBackend()
      },
    },
    { label: t(locale, 'tray.quit'), click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
}

function createTray() {
  tray = new Tray(path.join(VITE_PUBLIC, 'icon.png'))
  tray.setToolTip('Keysee')
  updateTrayMenu()
}

function resolveBackendPath(): string {
  if (VITE_DEV_SERVER_URL) return path.join(APP_ROOT, 'keysee-app-backend.exe')

  const local = path.join(process.resourcesPath, 'keysee-app-backend.exe')
  if (fs.existsSync(local)) return local

  return path.join(path.dirname(app.getPath('exe')), 'keysee-app-backend.exe')
}

function launchBackend() {
  const exe = resolveBackendPath()

  if (!fs.existsSync(exe)) {
    dialog.showMessageBox({
      type: 'error',
      title: t(locale, 'general.error'),
      message: t(locale, 'errors.backendMissing'),
    })
    return
  }

  backendProcess = spawn(exe, [], {
    stdio: 'pipe',
    windowsHide: true
  })

  backendProcess.on('exit', () => {
    backendProcess = null
  })

  const buffer: string[] = []

  backendProcess.stdout.setEncoding('utf8')
  backendProcess.stdout.on('data', (chunk: string) => {
    buffer.push(chunk)
    const combined = buffer.join('')
    const lines = combined.split('\n')

    for (let i = 0; i < lines.length - 1; i++) {
      try {
        const event = JSON.parse(lines[i])
        if (win) {
          win.webContents.send('input-event', event)
        }
      } catch (err) {
        // console.warn('Invalid event:', lines[i])
      }
    }

    buffer.length = 0
    if (!combined.endsWith('\n')) {
      buffer.push(lines[lines.length - 1])
    }
  })

  backendProcess.stderr.on('data', data => {
    console.error('[backend stderr]', data.toString())
  })
}

function cleanupBackend() {
  if (!backendProcess) return;

  try {
    if (process.platform === 'win32') {
      const { exec } = require('child_process');
      exec(`taskkill /PID ${backendProcess.pid} /T /F`, (err) => {
        if (err) console.error('Failed to kill process tree:', err);
      });
    } else {
      backendProcess.kill('SIGTERM');

      setTimeout(() => {
        if (backendProcess?.killed === false) {
          backendProcess.kill('SIGKILL');
        }
      }, 3000).unref();
    }
  } catch (err) {
    console.error('Error killing backend process:', err);
  }

  backendProcess = null;
}

function shouldCheckForUpdates(): boolean {
  const snoozeUntil = store.get('snoozeUpdateCheckUntil') as string | undefined
  if (!snoozeUntil) return true

  const now = new Date()
  return now > new Date(snoozeUntil)
}

export async function checkForUpdates() {
  try {
    const res = await fetch('https://api.github.com/repos/Sakhnovkrg/Keysee-App/releases/latest')

    if (!res.ok) {
      return
    }

    const data = await res.json()
    const latest = data.tag_name?.replace(/^v/, '')

    if (!latest) {
      return
    }

    if (semver.gt(latest, CURRENT_VERSION)) {
      const result = await dialog.showMessageBox({
        type: 'info',
        title: t(locale, 'update.availableTitle'),
        message: t(locale, 'update.availableMessage', { version: latest }),
        buttons: [t(locale, 'update.downloadButton'), t(locale, 'update.laterButton')],
        defaultId: 0,
        cancelId: 1,
      })

      if (result.response === 0) {
        shell.openExternal('https://github.com/Sakhnovkrg/Keysee-App/releases/latest')
      } else {
        const snoozeUntil = new Date()
        snoozeUntil.setDate(snoozeUntil.getDate() + 7)
        store.set({ snoozeUpdateCheckUntil: snoozeUntil.toISOString() })
      }
    }
  } catch (err) {
    console.warn('Update check error:', err)
  }
}

// Init
app.whenReady().then(() => {
  locale = getUserLocale()

  launchBackend()
  createWindow()
  createTray()


  if (shouldCheckForUpdates()) {
    checkForUpdates()
  }
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', cleanupBackend)
process.on('SIGINT', cleanupBackend)
process.on('SIGTERM', cleanupBackend)
process.on('exit', cleanupBackend)

if (process.platform === 'win32') {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('SIGINT', () => process.emit('SIGINT'))
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
