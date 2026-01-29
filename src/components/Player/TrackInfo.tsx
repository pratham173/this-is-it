
import { Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export function TrackInfo() {
  const { currentTrack } = usePlayer();

  if (!currentTrack) {
    return (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
          <Music size={24} className="text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">No track playing</p>
        </div>
      </div>
    );
  }

  const coverArt = currentTrack.coverArt || currentTrack.image || currentTrack.album_image;
  const artist = currentTrack.artist || currentTrack.artist_name || 'Unknown Artist';

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Album art */}
      <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        {coverArt ? (
          <img
            src={coverArt}
            alt={currentTrack.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music size={24} className="text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate" title={currentTrack.name}>
          {currentTrack.name}
        </p>
        <p className="text-sm text-muted-foreground truncate" title={artist}>
          {artist}
        </p>
      </div>
    </div>
  );
}
