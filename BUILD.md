# 🛠️ Building Keysee from Source

If you prefer to build Keysee yourself, here's how to do it.

---

## ✅ Requirements

- [Go 1.24.1](https://go.dev/dl/) or newer  
- [Node.js v22.14.0](https://nodejs.org/en/download)  
- [Git](https://git-scm.com/downloads)  
- Windows 10 or newer (Keysee is Windows-only)

---

## 📦 Install Dependencies

### Backend (Go)

```bash
cd backend
go mod tidy
```

### Frontend (Electron + Vue)

```bash
cd ../frontend
npm install
```

---

## ⚙️ Build Process

### 1. Build the Go backend

This will place the binary in the frontend folder:

```bash
go build -o ../frontend/keysee-app-backend.exe
```

### 2. Build the Electron app

```bash
cd ../frontend
npm run build
```

The output will be in the `release/` folder:

- `Keysee Setup X.Y.Z.exe` (installer)
- `win-unpacked/` (portable unpacked version)

---

## 🧠 Notes

- Keysee uses low-level input hooks (keyboard & mouse). Antivirus software may flag it.
- No data is sent anywhere.
- The source code is fully open — build it yourself if you’re unsure.