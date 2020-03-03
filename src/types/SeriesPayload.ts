export interface SeriesPayload {
  malId: number;
  title: string;
  image: string;
  series_type: string;
  isAdult: boolean;
  status: 'Planned';
  tagString: string;
}

export interface Manga extends SeriesPayload {
  series_chapters: number;
  series_volumes: number;
}

export interface Anime extends SeriesPayload {
  series_episodes: number;
  series_start: string | null;
}
