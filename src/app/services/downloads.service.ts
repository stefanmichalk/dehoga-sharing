import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Download, DirectusResponse } from '../interfaces/download.interface';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
  private apiUrl = 'https://dehoga-campaign.directus.app/items/downloads';
  private assetUrl = 'https://dehoga-campaign.directus.app/assets';

  constructor(private http: HttpClient) {
    console.log('DownloadsService initialized with:', {
      apiUrl: this.apiUrl,
      assetUrl: this.assetUrl
    });
  }

  getDownloads(): Observable<Download[]> {
    return this.http.get<DirectusResponse<Download>>(this.apiUrl)
      .pipe(
        tap(response => {
          if (!response.data) {
            console.warn('API Response has no data property');
          }
        }),
        map(response => response.data)
      );
  }

  getAllTags(downloads: Download[]): string[] {
    const tagsSet = new Set<string>();
    downloads.forEach(download => {
      if (download.tags) {
        download.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }

  getTagsForDownload(download: Download): string[] {
    return download.tags || [];
  }

  getFileUrl(fileId: string | null, options?: { width?: number, isPreview?: boolean, type?: string }): string {
    if (!fileId) {
      console.warn('No fileId provided to getFileUrl');
      return '';
    }

    // Entferne mögliche Anführungszeichen
    const cleanFileId = fileId.replace(/"/g, '');

    const baseUrl = `${this.assetUrl}/${cleanFileId}`;
    let finalUrl = baseUrl;

    // Wenn es ein Bild-Type ist und eine Preview angefordert wird, füge die Breite hinzu
    if (options?.isPreview && ['card', 'poster', 'postcard'].includes(options.type || '')) {
      finalUrl = `${baseUrl}?width=400&format=webp&quality=60`;
    }

    return finalUrl;
  }

  async downloadFile(download: Download): Promise<void> {
    const fileUrl = this.getFileUrl(download.file);
    if (!fileUrl) return;

    try {
      // Datei herunterladen
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Download-Link erstellen
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Dateiname aus dem Original-Namen oder fallback
      const filename = download.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const extension = this.getFileExtension(download.type);
      link.download = `${filename}${extension}`;

      // Download auslösen
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  private getFileExtension(type: string): string {
    switch (type) {
      case 'card':
      case 'poster':
      case 'postcard':
        return '.jpg';
      case 'file':
        return '.pdf';
      case 'video':
        return '.mp4';
      default:
        return '';
    }
  }
}
