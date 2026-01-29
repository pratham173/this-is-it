import { motion, AnimatePresence } from 'framer-motion';
import { PlayerControls } from './PlayerControls';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';
import { usePlayer } from '../../context/PlayerContext';
import { useMediaSession } from '../../hooks/useMediaSession';

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    playNext,
    playPrevious,
    seek,
  } = usePlayer();

  // Integrate with Media Session API
  useMediaSession(
    currentTrack,
    isPlaying,
    play,
    pause,
    playNext,
    playPrevious,
    seek
  );

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg"
        >
          <div className="container mx-auto px-4 py-3">
            {/* Desktop layout */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-8 md:items-center">
              {/* Track info - Left */}
              <div className="flex-1 min-w-0">
                <TrackInfo />
              </div>

              {/* Player controls - Center */}
              <div className="flex flex-col items-center gap-2">
                <PlayerControls />
                <SeekBar />
              </div>

              {/* Volume - Right */}
              <div className="flex justify-end">
                <VolumeControl />
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden space-y-3">
              <SeekBar />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <TrackInfo />
                </div>
                <div className="flex-shrink-0">
                  <PlayerControls />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
