import React, { useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export function SeekBar() {
  const { currentTime, duration, seek } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;

    if (isDragging) {
      setDragTime(newTime);
    } else {
      seek(newTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
    }
  };

  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-muted-foreground min-w-[40px] text-right">
        {formatTime(displayTime)}
      </span>

      <div
        ref={progressRef}
        className="relative flex-1 h-2 bg-secondary rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleSeek : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={isDragging ? handleSeek : undefined}
        onTouchEnd={handleTouchEnd}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={displayTime}
      >
        <div
          className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <span className="text-xs text-muted-foreground min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}
