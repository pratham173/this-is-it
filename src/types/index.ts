// Track interface
export interface Track {
  id: string;
  name: string;
  artist: string;
  artist_name?: string;
  album?: string;
  duration: number;
  audioUrl: string;
  audio?: string;
  audiodownload?: string;
  coverArt?: string;
  image?: string;
  album_image?: string;
  genre?: string;
  isLocal?: boolean;
  isDownloaded?: boolean;
  blob?: Blob;
}

// Playlist interface
export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  coverArt?: string;
  createdAt: number;
  updatedAt: number;
}

// Player state interface
export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

// Theme configuration
export type AccentColor = 'rose' | 'blue' | 'purple' | 'green' | 'orange' | 'cyan';

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
}

// Toast notification
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Jamendo API response types
export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  duration: number;
  audio: string;
  audiodownload: string;
}

export interface JamendoResponse {
  results: JamendoTrack[];
  headers: {
    results_count: number;
  };
}

// Storage interfaces
export interface DownloadedTrack extends Track {
  downloadedAt: number;
  blob: Blob;
}

export interface UploadedTrack extends Track {
  uploadedAt: number;
  blob: Blob;
  file: File;
}

export interface StorageInfo {
  used: number;
  quota: number;
  percentage: number;
}
