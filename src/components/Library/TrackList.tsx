
import { Track } from '../../types';
import { TrackCard } from './TrackCard';
import { TrackSkeleton } from '../ui/Skeleton';

interface TrackListProps {
  tracks: Track[];
  loading?: boolean;
  showIndex?: boolean;
  emptyMessage?: string;
}

export function TrackList({
  tracks,
  loading = false,
  showIndex = false,
  emptyMessage = 'No tracks found',
}: TrackListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrackSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => (
        <TrackCard
          key={track.id}
          track={track}
          index={index + 1}
          showIndex={showIndex}
        />
      ))}
    </div>
  );
}
