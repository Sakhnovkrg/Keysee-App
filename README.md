# Keysee

![Keysee Logo](keysee-logo.svg)

Keystrokes and mouse clicks are often invisible during tutorials and live demos. Keysee shows them as they happen.

![Showcase](demo.gif)

## Features

- ⌨️ Displays pressed keys and key combinations
- 🖱️ Shows scroll wheel with modifier keys (Ctrl+scroll, Shift+scroll, etc.)
- 🔇 Filters out noise (like repeated keys)
- ✨ Optional ripple effects for mouse clicks
- 🎨 Customizable appearance with saveable presets

## Security & Compatibility
- 🛡️ Each release includes a VirusTotal scan report for transparency. The code is open-source with no telemetry or user tracking (minimal network use for GitHub update checks only). If you prefer, [you can build it yourself](BUILD.md).
- 🪟 Currently available for Windows 10/11 only.

## Download

[Latest Release](https://github.com/Sakhnovkrg/Keysee-App/releases/latest)

## License

[MIT License](LICENSE)

## Project Structure

| Component  | Purpose                          | Tech Stack                               |
|------------|----------------------------------|------------------------------------------|
| `backend/` | Low-level input capture engine   | ![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white) |
| `frontend/`| Visual overlay application       | ![Electron](https://img.shields.io/badge/-Electron-47848F?logo=electron&logoColor=white) ![Vue](https://img.shields.io/badge/-Vue.js-4FC08D?logo=vue.js&logoColor=white) |