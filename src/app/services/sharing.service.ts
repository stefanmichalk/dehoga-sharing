import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SharingButton, SharingResponse } from '../models/sharing.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharingService {
  private readonly API_URL = 'https://dehoga-campaign.directus.app/items/sharing';

  constructor(private http: HttpClient) { }

  getSharingButtons(): Observable<SharingButton[]> {
    // Directus Filter Syntax
    const url = `${this.API_URL}?filter={"status":{"_eq":"published"}}`;
    console.log('Fetching sharing buttons from:', url);

    return this.http.get<SharingResponse>(url)
      .pipe(
        map(response => {
          if (response && Array.isArray(response.data)) {
            return response.data.sort((a, b) => a.sort - b.sort);
          }
          return [];
        })
      );
  }

  getButtonUrl(button: SharingButton, cardId: string, title: string): string {
    if (!cardId) {
      console.error('No cardId provided for sharing');
      return '';
    }

    // Baue die vollständige Detail-URL
    const detailUrl = `${environment.baseUrl}/share/${cardId}`;

    if (!button.shareurl) {
      return '';
    }

    // Ersetze die Platzhalter in der Share-URL
    let shareUrl = button.shareurl + encodeURIComponent(detailUrl);

    console.log('Final share URL:', shareUrl);
    return shareUrl;
  }
}
