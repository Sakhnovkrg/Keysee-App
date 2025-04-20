# 🛠️ Building Keysee from Source

If you prefer to build Keysee yourself, here's how to do it.

---

## ✅ Requirements

- [Go 1.24.1](https://go.dev/dl/) or newer  
- [Node.js v22.14.0](https://nodejs.org/en/download) or newer (might work with v18+, not tested)
- [Git](https://git-scm.com/downloads)  
- Windows 10 or newer (Keysee is Windows-only)

---

## 📥 Clone the repository

```bash
git clone https://github.com/Sakhnovkrg/Keysee-App.git
cd Keysee-App
```

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
cd ../backend
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