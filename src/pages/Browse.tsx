import React, { useState, useEffect } from 'react';
import { useJamendoAPI } from '../hooks/useJamendoAPI';
import { Track } from '../types';
import { TrackList } from '../components/Library/TrackList';
import { Button } from '../components/ui/Button';
import { clsx } from 'clsx';

const GENRES = [
  { id: 'pop', name: 'Pop' },
  { id: 'rock', name: 'Rock' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'classical', name: 'Classical' },
  { id: 'hiphop', name: 'Hip Hop' },
  { id: 'rnb', name: 'R&B' },
  { id: 'country', name: 'Country' },
  { id: 'reggae', name: 'Reggae' },
  { id: 'blues', name: 'Blues' },
];

export function Browse() {
  const { getTracksByGenre, loading } = useJamendoAPI();
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    loadGenreTracks();
  }, [selectedGenre]);

  const loadGenreTracks = async () => {
    const genreTracks = await getTracksByGenre(selectedGenre, 20);
    setTracks(genreTracks);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse</h1>
        <p className="text-muted-foreground">Explore music by genre</p>
      </div>

      {/* Genre buttons */}
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <Button
            key={genre.id}
            variant={selectedGenre === genre.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>

      {/* Track list */}
      <div>
        <h2 className="text-xl font-semibold mb-4 capitalize">
          {GENRES.find(g => g.id === selectedGenre)?.name} Tracks
        </h2>
        <TrackList
          tracks={tracks}
          loading={loading}
          emptyMessage={`No ${selectedGenre} tracks found`}
        />
      </div>
    </div>
  );
}
