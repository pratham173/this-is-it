import { useState, useCallback } from 'react';
import { Track } from '../types';
import * as jamendoApi from '../services/jamendoApi';

interface JamendoTrackResponse {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  duration: number;
  audio: string;
  audiodownload: string;
}

/**
 * Hook to interact with Jamendo API
 */
export function useJamendoAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToTrack = useCallback((jamendoTrack: JamendoTrackResponse): Track => {
    return {
      id: jamendoTrack.id,
      name: jamendoTrack.name,
      artist: jamendoTrack.artist_name,
      artist_name: jamendoTrack.artist_name,
      album: jamendoTrack.album_name,
      duration: jamendoTrack.duration,
      audioUrl: jamendoTrack.audio,
      audio: jamendoTrack.audio,
      audiodownload: jamendoTrack.audiodownload,
      coverArt: jamendoTrack.album_image,
      image: jamendoTrack.album_image,
      album_image: jamendoTrack.album_image,
      isLocal: false,
      isDownloaded: false,
    };
  }, []);

  const fetchTracks = useCallback(async (limit = 20, offset = 0): Promise<Track[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jamendoApi.fetchTracks({ limit, offset });
      const tracks = response.results.map(convertToTrack);
      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
      return [];
    } finally {
      setLoading(false);
    }
  }, [convertToTrack]);

  const searchTracks = useCallback(async (query: string, limit = 20): Promise<Track[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jamendoApi.searchTracks(query, limit);
      const tracks = response.results.map(convertToTrack);
      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tracks');
      return [];
    } finally {
      setLoading(false);
    }
  }, [convertToTrack]);

  const getTracksByGenre = useCallback(async (genre: string, limit = 20): Promise<Track[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jamendoApi.getTracksByGenre(genre, limit);
      const tracks = response.results.map(convertToTrack);
      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks by genre');
      return [];
    } finally {
      setLoading(false);
    }
  }, [convertToTrack]);

  const getTrendingTracks = useCallback(async (limit = 20): Promise<Track[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jamendoApi.getTrendingTracks(limit);
      const tracks = response.results.map(convertToTrack);
      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending tracks');
      return [];
    } finally {
      setLoading(false);
    }
  }, [convertToTrack]);

  const getNewReleases = useCallback(async (limit = 20): Promise<Track[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await jamendoApi.getNewReleases(limit);
      const tracks = response.results.map(convertToTrack);
      return tracks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch new releases');
      return [];
    } finally {
      setLoading(false);
    }
  }, [convertToTrack]);

  return {
    loading,
    error,
    fetchTracks,
    searchTracks,
    getTracksByGenre,
    getTrendingTracks,
    getNewReleases,
  };
}
