const JAMENDO_CLIENT_ID = 'your_jamendo_client_id';
const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

export interface JamendoApiParams {
  limit?: number;
  offset?: number;
  order?: 'popularity_total' | 'releasedate_desc' | 'name_asc';
  search?: string;
  tags?: string;
  include?: string;
}

/**
 * Fetch tracks from Jamendo API
 */
export async function fetchTracks(params: JamendoApiParams = {}) {
  const {
    limit = 20,
    offset = 0,
    order = 'popularity_total',
    search = '',
    tags = '',
    include = 'musicinfo'
  } = params;

  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: 'json',
    limit: limit.toString(),
    offset: offset.toString(),
    order,
    include,
    ...(search && { namesearch: search }),
    ...(tags && { tags })
  });

  const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tracks from Jamendo');
  }

  const data = await response.json();
  return data;
}

/**
 * Search tracks by query
 */
export async function searchTracks(query: string, limit = 20) {
  return fetchTracks({ search: query, limit });
}

/**
 * Get tracks by genre/tag
 */
export async function getTracksByGenre(genre: string, limit = 20) {
  return fetchTracks({ tags: genre, limit });
}

/**
 * Get trending tracks
 */
export async function getTrendingTracks(limit = 20) {
  return fetchTracks({ order: 'popularity_total', limit });
}

/**
 * Get new releases
 */
export async function getNewReleases(limit = 20) {
  return fetchTracks({ order: 'releasedate_desc', limit });
}
