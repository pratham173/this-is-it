import { useState, useCallback, useEffect } from 'react';
import { Track, DownloadedTrack, UploadedTrack, StorageInfo } from '../types';
import * as storage from '../services/offlineStorage';

/**
 * Hook to manage offline storage (downloads and uploads)
 */
export function useOfflineStorage() {
  const [downloadedTracks, setDownloadedTracks] = useState<DownloadedTrack[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    quota: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [downloads, uploads, info] = await Promise.all([
        storage.getAllDownloadedTracks(),
        storage.getAllUploadedTracks(),
        storage.getStorageInfo(),
      ]);

      setDownloadedTracks(downloads);
      setUploadedTracks(uploads);
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadTrack = useCallback(async (track: Track) => {
    try {
      // Download the audio file
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
      await loadData();
      return true;
    } catch (error) {
      console.error('Failed to download track:', error);
      return false;
    }
  }, [loadData]);

  const deleteDownload = useCallback(async (trackId: string) => {
    try {
      await storage.deleteDownloadedTrack(trackId);
      await loadData();
      return true;
    } catch (error) {
      console.error('Failed to delete downloaded track:', error);
      return false;
    }
  }, [loadData]);

  const uploadTrack = useCallback(async (file: File) => {
    try {
      // Extract metadata from filename
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      const parts = fileName.split(' - ');
      
      const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
      const name = parts.length > 1 ? parts.slice(1).join(' - ').trim() : fileName;

      // Create audio URL from blob
      const blob = file;
      const audioUrl = URL.createObjectURL(blob);

      const uploadedTrack: UploadedTrack = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        artist,
        artist_name: artist,
        duration: 0, // Will be set when audio loads
        audioUrl,
        blob,
        file,
        uploadedAt: Date.now(),
        isLocal: true,
      };

      await storage.saveUploadedTrack(uploadedTrack);
      await loadData();
      return uploadedTrack;
    } catch (error) {
      console.error('Failed to upload track:', error);
      return null;
    }
  }, [loadData]);

  const deleteUpload = useCallback(async (trackId: string) => {
    try {
      await storage.deleteUploadedTrack(trackId);
      await loadData();
      return true;
    } catch (error) {
      console.error('Failed to delete uploaded track:', error);
      return false;
    }
  }, [loadData]);

  const refreshStorageInfo = useCallback(async () => {
    const info = await storage.getStorageInfo();
    setStorageInfo(info);
  }, []);

  return {
    downloadedTracks,
    uploadedTracks,
    storageInfo,
    loading,
    downloadTrack,
    deleteDownload,
    uploadTrack,
    deleteUpload,
    refreshStorageInfo,
    refresh: loadData,
  };
}
