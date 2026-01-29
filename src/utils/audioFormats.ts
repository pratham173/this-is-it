/**
 * Supported audio formats for upload
 */
export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',      // MP3
  'audio/mp3',       // MP3
  'audio/wav',       // WAV
  'audio/ogg',       // OGG
  'audio/aac',       // AAC
  'audio/mp4',       // M4A
  'audio/x-m4a',     // M4A
] as const;

export const SUPPORTED_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.ogg',
  '.aac',
  '.m4a',
] as const;

/**
 * Check if a file is a supported audio format
 */
export function isSupportedAudioFormat(file: File): boolean {
  return SUPPORTED_AUDIO_FORMATS.includes(file.type as any) ||
    SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
}
