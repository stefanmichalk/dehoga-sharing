export interface MediaCard {
  id: string;
  title: string;
  description: string;
  image: string;
  blog: string;
  date_created: string;
  date_updated: string;
  link?: string;
  status: string;
  redirect: string;
  banner?: string;
  file?: string;
  imageUrl: string;
  hasVideoContent?: boolean;
  videoPlayUrl?: string;
  videoDownloadUrl?: string;
  tags?: string[];
}

export interface MediaCardResponse {
  data: MediaCard[];
}
