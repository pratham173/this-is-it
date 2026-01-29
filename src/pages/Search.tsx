import { useState } from 'react';
import { useJamendoAPI } from '../hooks/useJamendoAPI';
import { Track } from '../types';
import { SearchBar } from '../components/Library/SearchBar';
import { TrackList } from '../components/Library/TrackList';

export function Search() {
  const { searchTracks, loading } = useJamendoAPI();
  const [results, setResults] = useState<Track[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const tracks = await searchTracks(query, 30);
    setResults(tracks);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-muted-foreground mb-6">
          Find your favorite tracks, artists, and albums
        </p>
        <SearchBar onSearch={handleSearch} placeholder="Search for songs, artists..." />
      </div>

      {hasSearched && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </h2>
          <TrackList
            tracks={results}
            loading={loading}
            emptyMessage="No results found. Try different keywords."
          />
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Start typing to search for tracks
          </p>
        </div>
      )}
    </div>
  );
}
