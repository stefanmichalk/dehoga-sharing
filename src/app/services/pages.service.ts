import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = 'https://dehoga-campaign.directus.app/items/pages';
  private assetUrl = 'https://dehoga-campaign.directus.app/assets';

  constructor(private http: HttpClient) { }

  getPages(): Observable<Page[]> {
    return this.http.get<{ data: Page[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<{ data: Page }>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response.data,
        banner: response.data.banner ? `${this.assetUrl}/${response.data.banner}` : null
      }))
    );
  }
}
