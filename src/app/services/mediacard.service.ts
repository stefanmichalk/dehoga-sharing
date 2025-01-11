import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { MediaCard } from '../models/mediacard.model';

@Injectable({
  providedIn: 'root'
})
export class MediacardService {
  private readonly API_URL = 'https://dehoga-campaign.directus.app/items/mediacard';
  private readonly ASSETS_URL = 'https://dehoga-campaign.directus.app';
  private readonly apiUrl = 'https://dehoga-campaign.directus.app';

  constructor(private http: HttpClient) { }

  getMediaCards(): Observable<MediaCard[]> {
    // Add filter for published status
    const url = `${this.API_URL}?filter[status][_eq]=published`;
    return this.http
      .get<{ data: MediaCard[] }>(url)
      .pipe(map((response) => response.data));
  }

  getMediaCard(id: string): Observable<MediaCard> {
    // Add filter for published status
    const url = `${this.API_URL}/${id}?filter[status][_eq]=published`;
    return this.http
      .get<{ data: MediaCard }>(url)
      .pipe(
        tap(response => {
          console.log('Raw API Response:', response);
          console.log('Image fields:', {
            banner: response.data.banner,
            image: response.data.image
          });
        }),
        map((response) => response.data)
      );
  }

  getImageUrl(image: string | null): string {
    if (!image) return '';
    
    // Handle full URLs
    if (image.startsWith('http')) return image;
    
    // Handle Directus asset IDs with /assets/ path
    return `${this.ASSETS_URL}/assets/${image}`;
  }

  getFileUrl(path: string): string {
    return `${this.apiUrl}/files/${path}`;
  }
}
