# Harmony Music - Modern PWA Music Streaming App

A beautiful, feature-rich Progressive Web App for streaming, downloading, and organizing music. Built with React, TypeScript, and Tailwind CSS.

![Harmony Music](https://img.shields.io/badge/PWA-Harmony-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-blue)

## Features

### 🎵 Music Streaming
- Stream free, legal music via Jamendo API
- Browse trending tracks and new releases
- Search by song, artist, or genre
- Genre-based browsing

### 🎨 Modern UI/UX
- Clean, Apple Music-inspired design
- Glassmorphism effects
- Smooth Framer Motion animations
- Mobile-first responsive design
- Light/Dark mode with system preference detection
- 6 customizable accent colors (Rose, Blue, Purple, Green, Orange, Cyan)

### 🎧 Audio Player
- Full-featured playback controls (Play/Pause, Skip, Seek)
- Volume control with mute toggle
- Queue management
- Shuffle and repeat modes (none, one, all)
- Media Session API for lock screen controls
- Mini player bar + fullscreen expanded player

### 📥 Offline Support
- Service Worker for PWA functionality
- IndexedDB for local storage
- Download tracks for offline listening
- Upload local audio files (MP3, WAV, OGG, AAC, M4A)
- Automatic offline mode detection

### 📚 Library Management
- Create and manage playlists
- Upload local music files
- Downloaded tracks library
- Track metadata extraction

### ⚙️ Progressive Web App
- Installable on desktop and mobile
- Works offline
- Background playback
- Push notifications support

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pratham173/this-is-it.git
cd this-is-it
```

2. Install dependencies:
```bash
npm install
```

3. **Jamendo API Key** (Optional but recommended):
   
   The app comes with a demo API key (`56d30c95`) that works out of the box. However, for production use or heavy usage, you should get your own free API key:
   
   - Visit https://developer.jamendo.com
   - Sign up for a free account
   - Create a new application to get your client ID
   - Update `src/services/jamendoApi.ts` with your client ID:
     ```typescript
     const JAMENDO_CLIENT_ID = 'your_actual_client_id_here';
     ```
   
   **Note:** The demo key has rate limits and is shared among users. For the best experience and higher API limits, use your own free API key.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── components/
│   │   ├── Layout/        # Header, Sidebar, MainLayout
│   │   ├── Library/       # Track components, Playlists
│   │   ├── Player/        # Audio player components
│   │   ├── Upload/        # Upload modal
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API and storage services
│   ├── styles/            # Global styles and animations
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **idb** - IndexedDB wrapper
- **Lucide React** - Icon library
- **Jamendo API** - Free music streaming

## Features in Detail

### Theme System
- **Modes**: Light, Dark, System (auto-detects preference)
- **Accent Colors**: Rose, Blue, Purple, Green, Orange, Cyan
- **Persistence**: Settings saved to IndexedDB
- **Smooth Transitions**: Animated theme changes

### Audio Player
- **Playback Controls**: Play, Pause, Next, Previous
- **Seek Bar**: Click or drag to seek
- **Volume Control**: Slider with mute toggle
- **Queue**: Add tracks, shuffle, repeat modes
- **Media Session**: Lock screen controls on mobile

### Offline Storage
- **Downloads**: Save tracks for offline playback
- **Uploads**: Add your own music files
- **Playlists**: Create and organize tracks
- **Storage Info**: Monitor usage and quota

### PWA Features
- **Installable**: Add to home screen
- **Offline Mode**: Works without internet
- **Service Worker**: Caches assets and API responses
- **Background Sync**: Syncs when online

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## License

MIT License - feel free to use this project for learning or as a base for your own music app!

## Acknowledgments

- Music provided by [Jamendo](https://www.jamendo.com)
- Icons by [Lucide](https://lucide.dev)
- Inspired by Apple Music's design language

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.