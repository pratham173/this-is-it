
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export function PlayerControls() {
  const {
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    currentTrack,
  } = usePlayer();

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Shuffle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleShuffle}
        className={clsx('rounded-full p-2', shuffle && 'text-accent')}
        aria-label={shuffle ? 'Shuffle on' : 'Shuffle off'}
        title={shuffle ? 'Shuffle on' : 'Shuffle off'}
      >
        <Shuffle size={18} />
      </Button>

      {/* Previous */}
      <Button
        variant="ghost"
        size="sm"
        onClick={playPrevious}
        disabled={!currentTrack}
        className="rounded-full p-2"
        aria-label="Previous track"
      >
        <SkipBack size={20} />
      </Button>

      {/* Play/Pause */}
      <Button
        variant="primary"
        size="lg"
        onClick={togglePlayPause}
        disabled={!currentTrack}
        className="rounded-full p-3"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
      </Button>

      {/* Next */}
      <Button
        variant="ghost"
        size="sm"
        onClick={playNext}
        disabled={!currentTrack}
        className="rounded-full p-2"
        aria-label="Next track"
      >
        <SkipForward size={20} />
      </Button>

      {/* Repeat */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRepeat}
        className={clsx('rounded-full p-2', repeat !== 'none' && 'text-accent')}
        aria-label={`Repeat: ${repeat}`}
        title={`Repeat: ${repeat}`}
      >
        <RepeatIcon size={18} />
      </Button>
    </div>
  );
}
