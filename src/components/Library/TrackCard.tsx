import React from 'react';
import { Music, Play, Download, MoreVertical } from 'lucide-react';
import { Track } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

interface TrackCardProps {
  track: Track;
  index?: number;
  showIndex?: boolean;
}

export function TrackCard({ track, index, showIndex = false }: TrackCardProps) {
  const { setQueue, currentTrack, isPlaying } = usePlayer();
  const { downloadTrack, isTrackDownloaded } = useLibrary();
  const { showToast } = useToast();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isDownloaded = isTrackDownloaded(track.id);
  const coverArt = track.coverArt || track.image || track.album_image;
  const artist = track.artist || track.artist_name || 'Unknown Artist';

  const handlePlay = () => {
    setQueue([track], 0);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloaded) {
      showToast('Track already downloaded', 'info');
      return;
    }

    showToast('Downloading track...', 'info');
    const success = await downloadTrack(track);
    if (success) {
      showToast('Track downloaded successfully', 'success');
    } else {
      showToast('Failed to download track', 'error');
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={clsx(
        'group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary',
        isCurrentTrack && isPlaying && 'bg-accent/10'
      )}
    >
      {/* Index or album art */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {showIndex && !coverArt ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground group-hover:hidden">{index}</span>
            <Play size={20} className="hidden group-hover:block" />
          </div>
        ) : (
          <>
            {coverArt ? (
              <img
                src={coverArt}
                alt={track.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                <Music size={20} className="text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={20} className="text-white" />
            </div>
          </>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={clsx('font-medium truncate', isCurrentTrack && 'text-accent')}>
          {track.name}
        </p>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
      </div>

      {/* Duration and actions */}
      <div className="flex items-center gap-2">
        {!track.isLocal && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isDownloaded ? 'Downloaded' : 'Download'}
          >
            <Download size={16} className={isDownloaded ? 'text-accent' : ''} />
          </Button>
        )}
        <span className="text-sm text-muted-foreground min-w-[40px] text-right">
          {formatTime(track.duration)}
        </span>
      </div>
    </div>
  );
}
