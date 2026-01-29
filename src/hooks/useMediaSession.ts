import { useEffect } from 'react';
import { Track } from '../types';

/**
 * Hook to integrate with Media Session API for lock screen controls
 */
export function useMediaSession(
  track: Track | null,
  isPlaying: boolean,
  onPlay: () => void,
  onPause: () => void,
  onNext: () => void,
  onPrevious: () => void,
  onSeek: (time: number) => void
) {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: track.artist || track.artist_name || 'Unknown Artist',
      album: track.album || 'Unknown Album',
      artwork: track.coverArt || track.image || track.album_image
        ? [
            {
              src: track.coverArt || track.image || track.album_image || '',
              sizes: '512x512',
              type: 'image/png',
            },
          ]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    navigator.mediaSession.setActionHandler('nexttrack', onNext);
    navigator.mediaSession.setActionHandler('previoustrack', onPrevious);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        onSeek(details.seekTime);
      }
    });

    // Update playback state
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      }
    };
  }, [track, isPlaying, onPlay, onPause, onNext, onPrevious, onSeek]);
}
