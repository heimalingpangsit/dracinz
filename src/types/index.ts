export interface Drama {
  id: string;
  title: string;
  name?: string;
  slug: string;
  cover: string;
  rating?: number;
  year?: number;
  introduction?: string;
  genres?: string[];
  episodesCount?: number;
  url: string;
}

export interface Genre {
  name: string;
  slug: string;
  url: string;
}

export interface Episode {
  title: string;
  subtitle?: string;
  url: string;
  number: number;
  duration?: string;
  isLocked?: boolean;
  thumbnail?: string;
  cover?: string;
}

export interface RecommendationSection {
  sectionTitle: string;
  movies: Drama[];
}

export interface MovieDetail {
  title: string;
  slug: string;
  id: string;
  cover?: string;
  synopsis: string;
  genres: Genre[];
  episodes: Episode[];
  recommendations: RecommendationSection[];
}

export interface VideoSource {
  quality: number;
  url: string;
  cdn?: string | null;
}

export interface StreamInfo {
  title: string;
  videoSources: VideoSource[];
  availableEpisodes: Episode[];
}

export type ViewMode = 'home' | 'search' | 'collections' | 'detail' | 'player';

export type SortOption = 'populer' | 'terbaru' | 'a-z';
