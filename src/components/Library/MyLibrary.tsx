import React, { useState } from 'react';
import { Upload, Music, Trash2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { TrackList } from './TrackList';
import { Button } from '../ui/Button';
import { UploadModal } from '../Upload/UploadModal';

export function MyLibrary() {
  const { uploadedTracks, downloadedTracks, deleteUploadedTrack, deleteDownloadedTrack } = useLibrary();
  const { showToast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'uploads' | 'downloads'>('uploads');

  const handleDeleteUpload = async (id: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
      await deleteUploadedTrack(id);
      showToast('Track deleted', 'success');
    }
  };

  const handleDeleteDownload = async (id: string) => {
    if (confirm('Are you sure you want to delete this downloaded track?')) {
      await deleteDownloadedTrack(id);
      showToast('Download removed', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">Your uploaded and downloaded tracks</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2">
          <Upload size={20} />
          Upload Track
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'uploads'
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Uploads ({uploadedTracks.length})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'downloads'
              ? 'text-accent border-b-2 border-accent'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Downloads ({downloadedTracks.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'uploads' && (
        <TrackList
          tracks={uploadedTracks}
          emptyMessage="No uploaded tracks. Upload your first track!"
        />
      )}

      {activeTab === 'downloads' && (
        <TrackList
          tracks={downloadedTracks}
          emptyMessage="No downloaded tracks. Download tracks for offline listening!"
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
