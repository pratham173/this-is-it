import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Track, Playlist, UploadedTrack, DownloadedTrack } from '../types';
import * as storage from '../services/offlineStorage';

interface LibraryContextValue {
  playlists: Playlist[];
  uploadedTracks: UploadedTrack[];
  downloadedTracks: DownloadedTrack[];
  loading: boolean;
  createPlaylist: (name: string, description: string) => Promise<Playlist>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  uploadTrack: (file: File) => Promise<UploadedTrack | null>;
  deleteUploadedTrack: (id: string) => Promise<void>;
  downloadTrack: (track: Track) => Promise<boolean>;
  deleteDownloadedTrack: (id: string) => Promise<void>;
  isTrackDownloaded: (trackId: string) => boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [downloadedTracks, setDownloadedTracks] = useState<DownloadedTrack[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshLibrary();
  }, []);

  const refreshLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const [playlistsData, uploadsData, downloadsData] = await Promise.all([
        storage.getAllPlaylists(),
        storage.getAllUploadedTracks(),
        storage.getAllDownloadedTracks(),
      ]);

      setPlaylists(playlistsData);
      setUploadedTracks(uploadsData);
      setDownloadedTracks(downloadsData);
    } catch (error) {
      console.error('Failed to load library data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async (name: string, description: string): Promise<Playlist> => {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.savePlaylist(playlist);
    await refreshLibrary();
    return playlist;
  }, [refreshLibrary]);

  const updatePlaylist = useCallback(async (id: string, updates: Partial<Playlist>) => {
    const playlist = await storage.getPlaylist(id);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const updatedPlaylist: Playlist = {
      ...playlist,
      ...updates,
      updatedAt: Date.now(),
    };

    await storage.savePlaylist(updatedPlaylist);
    await refreshLibrary();
  }, [refreshLibrary]);

  const deletePlaylist = useCallback(async (id: string) => {
    await storage.deletePlaylist(id);
    await refreshLibrary();
  }, [refreshLibrary]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, track: Track) => {
    const playlist = await storage.getPlaylist(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Check if track already exists
    if (playlist.tracks.some(t => t.id === track.id)) {
      return;
    }

    const updatedPlaylist: Playlist = {
      ...playlist,
      tracks: [...playlist.tracks, track],
      updatedAt: Date.now(),
    };

    await storage.savePlaylist(updatedPlaylist);
    await refreshLibrary();
  }, [refreshLibrary]);

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    const playlist = await storage.getPlaylist(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const updatedPlaylist: Playlist = {
      ...playlist,
      tracks: playlist.tracks.filter(t => t.id !== trackId),
      updatedAt: Date.now(),
    };

    await storage.savePlaylist(updatedPlaylist);
    await refreshLibrary();
  }, [refreshLibrary]);

  const uploadTrack = useCallback(async (file: File): Promise<UploadedTrack | null> => {
    try {
      // Extract metadata from filename
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      const parts = fileName.split(' - ');
      
      const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
      const name = parts.length > 1 ? parts.slice(1).join(' - ').trim() : fileName;

      const blob = file;
      const audioUrl = URL.createObjectURL(blob);

      const uploadedTrack: UploadedTrack = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        artist,
        artist_name: artist,
        duration: 0,
        audioUrl,
        blob,
        file,
        uploadedAt: Date.now(),
        isLocal: true,
      };

      await storage.saveUploadedTrack(uploadedTrack);
      await refreshLibrary();
      return uploadedTrack;
    } catch (error) {
      console.error('Failed to upload track:', error);
      return null;
    }
  }, [refreshLibrary]);

  const deleteUploadedTrack = useCallback(async (id: string) => {
    await storage.deleteUploadedTrack(id);
    await refreshLibrary();
  }, [refreshLibrary]);

  const downloadTrack = useCallback(async (track: Track): Promise<boolean> => {
    try {
      const audioUrl = track.audiodownload || track.audio || track.audioUrl;
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      const downloadedTrack: DownloadedTrack = {
        ...track,
        downloadedAt: Date.now(),
        blob,
        isDownloaded: true,
      };

      await storage.saveDownloadedTrack(downloadedTrack);
      await refreshLibrary();
      return true;
    } catch (error) {
      console.error('Failed to download track:', error);
      return false;
    }
  }, [refreshLibrary]);

  const deleteDownloadedTrack = useCallback(async (id: string) => {
    await storage.deleteDownloadedTrack(id);
    await refreshLibrary();
  }, [refreshLibrary]);

  const isTrackDownloaded = useCallback((trackId: string): boolean => {
    return downloadedTracks.some(track => track.id === trackId);
  }, [downloadedTracks]);

  const value: LibraryContextValue = {
    playlists,
    uploadedTracks,
    downloadedTracks,
    loading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    uploadTrack,
    deleteUploadedTrack,
    downloadTrack,
    deleteDownloadedTrack,
    isTrackDownloaded,
    refreshLibrary,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
}
