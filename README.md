# Charcoal Studio 🎵

> **Tactile Audio Sanctuary & 3D Vinyl Player**  
> *"Choose your Nirvana"*

A minimalist, high-performance web music player designed with a clean Inter aesthetic. Built as a local-first application where your personal music library is stored securely on your device with zero cloud tracking, zero latency, and zero subscription fees.

---

## ✨ Features

- **💿 Tactile 3D Vinyl Crate Deck**: Flip through vertically stacked vinyl records in 3D perspective space with fluid pull-to-play animations.
- **🎵 Universal Audio Engine**: Full support for MP3, WAV, FLAC, AAC, M4A, and OGG formats with interactive waveform scrubbing.
- **🔀 Playback Modes**: True randomized shuffle and 3-state repeat (*Off*, *Repeat All*, *Repeat One*).
- **🔒 Local-First Persistence**: Your tracks and sleeve artwork are stored directly in your browser's **IndexedDB** (`Blob` storage). Songs persist across browser restarts on the same device.
- **📱 Responsive Architecture**:
  - **Desktop View**: 3-column studio layout (Sidebar, Main Viewport with Album Hero & Crate/Tracklist, Now Playing Queue panel, and persistent bottom bar).
  - **Mobile View ($\le 768\text{px}$)**: Clean single-line header (`Charcoal Studio`, `+ Add Song`, `Log In`, `Sign Up`), floating mini-player, slide-up Now Playing sheet, and a 3-button bottom footer (`Home`, `Search`, `Crate`).
- **✨ Capacitive Touch Matrix**: Interactive micro-dot canvas on the landing screen that responds dynamically to finger touch and cursor press.

---

## 🛠️ Tech Stack

- **Frontend**: Pure Semantic HTML5, Modern CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+).
- **Audio & Media**: HTML5 Web Audio API, Canvas 2D API for waveforms and touch matrix.
- **Client Storage**: Browser IndexedDB for audio/image blobs; `localStorage` for user accounts.
- **Hosting**: Static edge deployment (Vercel-ready).

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser, or serve it locally:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve .
```

Navigate to `http://localhost:8000` to choose your Nirvana.
