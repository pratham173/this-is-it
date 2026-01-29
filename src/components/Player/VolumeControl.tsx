import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Button } from '../ui/Button';

export function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = usePlayer();
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();
  const displayVolume = isMuted ? 0 : volume;

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        className="rounded-full p-2"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon size={20} />
      </Button>

      {showSlider && (
        <div
          ref={sliderRef}
          className="hidden md:block relative w-24 h-2 bg-secondary rounded-full cursor-pointer group"
          onClick={handleVolumeChange}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayVolume * 100}
        >
          <div
            className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all"
            style={{ width: `${displayVolume * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${displayVolume * 100}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      )}
    </div>
  );
}
