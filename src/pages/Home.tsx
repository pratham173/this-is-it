import { useEffect, useState } from 'react';
import { useJamendoAPI } from '../hooks/useJamendoAPI';
import { Track } from '../types';
import { TrackList } from '../components/Library/TrackList';

export function Home() {
  const { getTrendingTracks, getNewReleases, loading } = useJamendoAPI();
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [trending, releases] = await Promise.all([
      getTrendingTracks(10),
      getNewReleases(10),
    ]);

    setTrendingTracks(trending);
    setNewReleases(releases);
  };

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Harmony
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover, stream, and download millions of free tracks. Built with modern web technologies for the best listening experience.
        </p>
      </section>

      {/* Trending tracks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <TrackList tracks={trendingTracks} loading={loading} showIndex />
      </section>

      {/* New releases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">New Releases</h2>
        <TrackList tracks={newReleases} loading={loading} showIndex />
      </section>
    </div>
  );
}
