import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Block } from '../models/block.interface';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private readonly API_URL = 'https://dehoga-campaign.directus.app/items/blocks';
  private readonly ASSETS_URL = 'https://dehoga-campaign.directus.app/assets';

  constructor(private http: HttpClient) {}

  getBlocks(): Observable<Block[]> {
    // Add filter for published status
    const url = `${this.API_URL}?filter[status][_eq]=published`;
    return this.http
      .get<{ data: Block[] }>(url)
      .pipe(
        tap(response => console.log('Blocks API response:', response)),
        map((response) => response.data)
      );
  }

  getImageUrl(imageId: string): string {
    return `${this.ASSETS_URL}/${imageId}`;
  }
}
