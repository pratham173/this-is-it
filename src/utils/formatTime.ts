/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format duration to human readable format (e.g., "3 min 45 sec")
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) {
    return '0 sec';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins === 0) {
    return `${secs} sec`;
  }

  return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
}
