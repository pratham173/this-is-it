import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { Track, PlayerState } from '../types';

interface PlayerContextValue extends PlayerState {
  audioRef: React.RefObject<HTMLAudioElement>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setTrack: (track: Track) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audioUrl = currentTrack.audioUrl || currentTrack.audio || '';
      
      // If track has a blob, create object URL
      if (currentTrack.blob) {
        audioRef.current.src = URL.createObjectURL(currentTrack.blob);
      } else {
        audioRef.current.src = audioUrl;
      }
      
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (clampedVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index === queueIndex) {
      // If removing current track, play next
      playNext();
    } else if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  }, [queueIndex]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;
    
    if (repeat === 'one') {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        play();
      }
      return;
    }

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        pause();
        return;
      }
    }

    setQueueIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(false);
    setTimeout(() => play(), 100);
  }, [queue, queueIndex, repeat, play, pause]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;

    // If more than 3 seconds played, restart current track
    if (currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    
    if (prevIndex < 0) {
      if (repeat === 'all') {
        prevIndex = queue.length - 1;
      } else {
        seek(0);
        return;
      }
    }

    setQueueIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(false);
    setTimeout(() => play(), 100);
  }, [queue, queueIndex, currentTime, repeat, seek, play]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  const setQueueWithTracks = useCallback((tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setQueueIndex(startIndex);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[startIndex]);
      setIsPlaying(false);
      setTimeout(() => play(), 100);
    }
  }, [play]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(-1);
    setCurrentTrack(null);
    pause();
  }, [pause]);

  const value: PlayerContextValue = {
    audioRef,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    queue,
    queueIndex,
    shuffle,
    repeat,
    play,
    pause,
    togglePlayPause,
    setTrack,
    setVolume,
    toggleMute,
    seek,
    addToQueue,
    removeFromQueue,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    setQueue: setQueueWithTracks,
    clearQueue,
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playNext]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
