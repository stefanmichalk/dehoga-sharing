export interface Block {
  id?: string;
  headline?: string;
  content: string;
  image?: string;
  imageDescription?: string;
  imagePosition?: 'top' | 'right' | 'bottom' | 'left';
  relatedPage?: string;
  status?: string;
  sort?: number;
}
