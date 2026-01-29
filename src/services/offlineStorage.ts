import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Track, Playlist, DownloadedTrack, UploadedTrack, ThemeConfig } from '../types';

interface HarmonyDB extends DBSchema {
  tracks: {
    key: string;
    value: DownloadedTrack;
  };
  uploads: {
    key: string;
    value: UploadedTrack;
  };
  playlists: {
    key: string;
    value: Playlist;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'harmony-music-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<HarmonyDB> | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBPDatabase<HarmonyDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<HarmonyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('uploads')) {
        db.createObjectStore('uploads', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });

  return dbInstance;
}

// Track operations
export async function saveDownloadedTrack(track: DownloadedTrack) {
  const db = await initDB();
  await db.put('tracks', track);
}

export async function getDownloadedTrack(id: string): Promise<DownloadedTrack | undefined> {
  const db = await initDB();
  return db.get('tracks', id);
}

export async function getAllDownloadedTracks(): Promise<DownloadedTrack[]> {
  const db = await initDB();
  return db.getAll('tracks');
}

export async function deleteDownloadedTrack(id: string) {
  const db = await initDB();
  await db.delete('tracks', id);
}

// Upload operations
export async function saveUploadedTrack(track: UploadedTrack) {
  const db = await initDB();
  await db.put('uploads', track);
}

export async function getUploadedTrack(id: string): Promise<UploadedTrack | undefined> {
  const db = await initDB();
  return db.get('uploads', id);
}

export async function getAllUploadedTracks(): Promise<UploadedTrack[]> {
  const db = await initDB();
  return db.getAll('uploads');
}

export async function deleteUploadedTrack(id: string) {
  const db = await initDB();
  await db.delete('uploads', id);
}

// Playlist operations
export async function savePlaylist(playlist: Playlist) {
  const db = await initDB();
  await db.put('playlists', playlist);
}

export async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const db = await initDB();
  return db.get('playlists', id);
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await initDB();
  return db.getAll('playlists');
}

export async function deletePlaylist(id: string) {
  const db = await initDB();
  await db.delete('playlists', id);
}

// Settings operations
export async function saveSetting(key: string, value: any) {
  const db = await initDB();
  await db.put('settings', value, key);
}

export async function getSetting(key: string): Promise<any> {
  const db = await initDB();
  return db.get('settings', key);
}

// Storage info
export async function getStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (used / quota) * 100 : 0;

    return {
      used,
      quota,
      percentage,
    };
  }

  return {
    used: 0,
    quota: 0,
    percentage: 0,
  };
}
