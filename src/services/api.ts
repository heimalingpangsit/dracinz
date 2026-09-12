import { Drama, Genre, MovieDetail, StreamInfo } from '../types/index.js';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API call failed: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to retrieve data');
  }
  return json.data;
}

export async function fetchHome(): Promise<{ dramas: Drama[]; genres: Genre[] }> {
  return fetchJson<{ dramas: Drama[]; genres: Genre[] }>('/api/dracinema/home');
}

export async function fetchCollections(): Promise<Genre[]> {
  return fetchJson<Genre[]>('/api/dracinema/collections');
}

export async function fetchMovies(page = 1): Promise<Drama[]> {
  const res = await fetch(`/api/dracinema/movies?page=${page}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchGenreMovies(slug: string, page = 1): Promise<Drama[]> {
  const res = await fetch(`/api/dracinema/genre?slug=${encodeURIComponent(slug)}&page=${page}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchSearchResults(keyword: string): Promise<Drama[]> {
  if (!keyword.trim()) return [];
  const res = await fetch(`/api/dracinema/search?keyword=${encodeURIComponent(keyword)}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchMovieDetails(slugOrPath: string): Promise<MovieDetail> {
  const clean = slugOrPath.replace(/^\/movie\//, '');
  return fetchJson<MovieDetail>(`/api/dracinema/detail?slug=${encodeURIComponent(clean)}`);
}

export async function fetchEpisodeStream(playUrlOrPath: string): Promise<StreamInfo> {
  return fetchJson<StreamInfo>(`/api/dracinema/play?url=${encodeURIComponent(playUrlOrPath)}`);
}
