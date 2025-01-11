export interface SharingButton {
  id: string;
  status: 'published' | 'draft';
  sort: number;
  name: string;
  label: string;
  color: string;
  icon: string;
  shareurl: string;
}

export interface SharingResponse {
  data: SharingButton[];
}
