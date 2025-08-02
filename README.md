# Keysee

![Keysee Logo](keysee-logo.svg)

**Keysee** is a free and open-source tool that displays real-time keyboard and mouse input on screen. 

![Showcase](demo.gif)

## Why use Keysee?

When watching tutorials or live demos, it's often unclear what keys or key combinations are being pressed. Keysee displays keyboard input and key combinations in real-time, with optional visual effects for mouse clicks.

## Features

- Displays pressed keys and key combinations
- Shows scroll wheel interactions
- Filters out noise (like repeated keys)
- Optional ripple effects for mouse clicks
- Customizable appearance with saveable presets

## Notes
- ⚠️ Some antivirus software may flag this app because it uses system hooks to detect keyboard and mouse input.
The code is open-source, and nothing is sent anywhere — no tracking, no network activity.
If you're unsure, [you can build it yourself](BUILD.md). Totally up to you.
- Currently available for Windows 10/11 only.

## Download

[Download for Windows 10+](https://github.com/Sakhnovkrg/Keysee-App/releases/latest)

## License

[MIT License](LICENSE)

## Project Structure

| Component  | Purpose                          | Tech Stack                               |
|------------|----------------------------------|------------------------------------------|
| `backend/` | Low-level input capture engine   | ![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white) |
| `frontend/`| Visual overlay application       | ![Electron](https://img.shields.io/badge/-Electron-47848F?logo=electron&logoColor=white) ![Vue](https://img.shields.io/badge/-Vue.js-4FC08D?logo=vue.js&logoColor=white) |