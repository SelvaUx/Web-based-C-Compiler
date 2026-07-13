# 🛠️ CodeForge IDE — Professional Online C Compiler

[![Live Demo](https://img.shields.io/badge/Live%20Demo-c--learner.netlify.app-18a0fb?style=for-the-badge&logo=netlify&logoColor=white)](https://c-learner.netlify.app/)

CodeForge IDE is a premium, web-based C development environment designed to run fully client-side in the browser. It features a VS Code-style workspace with resizable panels, a tabbed editor layout, full standard library auto-completions, and a sandboxed remote compiler fallback system.

---

## 🌟 Core Features

- **📝 Advanced Code Editor (Monaco)**:
  - Syntax highlighting, code folding, word wrap, and line number indicators.
  - Custom C Language IntelliSense & standard library auto-completions.
  - Multi-file tab bar with save markers.
  - Real-time build error line highlighting inside the editor workspace.
- **💻 Console Terminal Emulator (xterm.js)**:
  - Supports ANSI colors, input buffering, clear output logs, and session downloads.
- **📁 Multi-File Project Manager**:
  - File tree view support for creating, renaming, deleting, and uploading local `.c`/`.h` files.
  - Auto-saving state persisted to **IndexedDB** client-side.
- **⚡ Resilient Compilation Architecture**:
  - Primary CodeX API and fallback Wandbox compiler integration.
  - **Circuit Breaker** logic bypasses offline compilation APIs automatically to reduce latency.
- **🎨 Rich Modern UI**:
  - Responsive layout with draggable panel splitters, dark/light themes, and custom animations.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Terminal**: `xterm.js`
- **Compiler**: CodeX API & Wandbox API via CORS Proxy
- **State Management**: Zustand
- **Storage**: IndexedDB (via `idb` package)

---

## 🚀 Getting Started

### Local Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SelvaUx/Web-based-C-Compiler.git
   cd Web-based-C-Compiler
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start local Dev Server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**:
   Visit `http://localhost:5173`.

### Production Build
To create a production-optimized build (destined for Vercel/Netlify):
```bash
npm run build
```

---

## 🌍 Connect with Me

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-selvaux.in-00d4ff?style=for-the-badge&logo=safari&logoColor=white)](https://selvaux.in)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Selva_Pandi-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/selvaux)
[![Instagram](https://img.shields.io/badge/Instagram-selva.ux-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/selva.ux)
[![GitHub](https://img.shields.io/badge/GitHub-SelvaUx-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SelvaUx)
[![Email](https://img.shields.io/badge/Email-selva.ux%40yahoo.com-D44638?style=for-the-badge&logo=yahoo&logoColor=white)](mailto:selva.ux@yahoo.com)

</div>

---

**Developed with ❤️ by [Selva.Ux](https://selvaux.in)**
