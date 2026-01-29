import React, { useState } from 'react';
import { Plus, Music, Trash2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { Playlist } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TrackList } from './TrackList';

export function Playlists() {
  const { playlists, createPlaylist, deletePlaylist } = useLibrary();
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      showToast('Please enter a playlist name', 'error');
      return;
    }

    await createPlaylist(playlistName, playlistDescription);
    showToast('Playlist created', 'success');
    setIsCreateModalOpen(false);
    setPlaylistName('');
    setPlaylistDescription('');
  };

  const handleDeletePlaylist = async (id: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(id);
      showToast('Playlist deleted', 'success');
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Playlists</h1>
          <p className="text-muted-foreground">Organize your favorite tracks</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Create Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No playlists yet</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Playlist</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              hover
              onClick={() => setSelectedPlaylist(playlist)}
              className="cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg mb-3 flex items-center justify-center">
                <Music size={48} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-1 truncate">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlaylist(playlist.id);
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Playlist"
      >
        <form onSubmit={handleCreatePlaylist} className="space-y-4">
          <div>
            <label htmlFor="playlist-name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="playlist-name"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full px-3 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="playlist-description" className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <textarea
              id="playlist-description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="A collection of my favorite tracks"
              className="w-full px-3 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      {/* Playlist Details Modal */}
      <Modal
        isOpen={!!selectedPlaylist}
        onClose={() => setSelectedPlaylist(null)}
        title={selectedPlaylist?.name || ''}
      >
        {selectedPlaylist && (
          <div className="space-y-4">
            {selectedPlaylist.description && (
              <p className="text-muted-foreground">{selectedPlaylist.description}</p>
            )}
            <TrackList
              tracks={selectedPlaylist.tracks}
              emptyMessage="No tracks in this playlist"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
