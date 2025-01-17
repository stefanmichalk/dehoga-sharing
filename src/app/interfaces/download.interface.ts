export type DownloadType = 'file' | 'poster' | 'postcard' | 'card' | 'video';

export interface Download {
  id: string;
  name: string;
  description?: string;
  type: DownloadType;
  file: string;
  preview: string | null;
  tags: string[];
  date_created?: string;
  date_updated?: string;
  status: string;
}

export interface DirectusResponse<T> {
  data: T[];
}
