import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor() {}

  getAssetUrl(assetId: string): string {
    // Hier können Sie die URL-Logik an Ihre Backend-API anpassen
    return `/assets/images/${assetId}`;
  }
}
