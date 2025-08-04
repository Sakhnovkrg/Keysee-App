# 🛠️ Building Keysee from Source

If you prefer to build Keysee yourself, here's how to do it.

---

## ✅ Requirements

- [Go 1.24.1](https://go.dev/dl/) or newer  
- [Node.js v22.14.0](https://nodejs.org/en/download) or newer (might work with v18+, not tested)
- [Git](https://git-scm.com/downloads)  
- Windows 10 or newer (Keysee is Windows-only)

---

## 🚀 Build Steps

```cmd
git clone https://github.com/Sakhnovkrg/Keysee-App.git
cd Keysee-App
cd backend
go mod tidy
go build -o ../frontend/keysee-app-backend.exe
cd ../frontend
npm install
npm run build
```

The output will be in the `frontend/release/` folder:

- `Keysee Setup X.Y.Z.exe` (installer)
- `win-unpacked/` (portable unpacked version)

---
