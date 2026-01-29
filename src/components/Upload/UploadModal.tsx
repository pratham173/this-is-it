import React, { useState, useRef } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLibrary } from '../../context/LibraryContext';
import { useToast } from '../../context/ToastContext';
import { isSupportedAudioFormat } from '../../utils/audioFormats';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { uploadTrack } = useLibrary();
  const { showToast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (isSupportedAudioFormat(file)) {
        return true;
      }
      showToast(`${file.name} is not a supported audio format`, 'error');
      return false;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select at least one file', 'error');
      return;
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const result = await uploadTrack(file);
        if (result) {
          showToast(`${file.name} uploaded successfully`, 'success');
        } else {
          showToast(`Failed to upload ${file.name}`, 'error');
        }
      }

      setSelectedFiles([]);
      onClose();
    } catch (error) {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => isSupportedAudioFormat(file));
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Music">
      <div className="space-y-4">
        {/* Drag and drop area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
        >
          <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop audio files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: MP3, WAV, OGG, AAC, M4A
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected files ({selectedFiles.length})</p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Music size={20} className="text-accent flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="rounded-full p-2 flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
