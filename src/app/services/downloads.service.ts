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

  getPreviewUrl(previewId: string | null): string {
    if (!previewId) {
      console.warn('No previewId provided to getPreviewUrl');
      return '';
    }

    console.log('Generating preview URL for ID:', previewId);
    const cleanPreviewId = previewId.replace(/"/g, '');
    const url = `${this.assetUrl}/${cleanPreviewId}?width=400&format=webp&quality=60`;
    console.log('Generated preview URL:', url);
    return url;
  }

  getDownloadUrl(fileId: string | null): string {
    if (!fileId) {
      console.warn('No fileId provided to getDownloadUrl');
      return '';
    }

    const cleanFileId = fileId.replace(/"/g, '');
    return `${this.assetUrl}/${cleanFileId}/download`;
  }

  async downloadFile(download: Download): Promise<void> {
    const fileUrl = this.getDownloadUrl(download.file);
    if (!fileUrl) return;

    try {
      // Datei herunterladen
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Original-Dateiname aus dem Content-Disposition Header extrahieren, falls vorhanden
      let filename = download.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          // Anführungszeichen entfernen, falls vorhanden
          const originalFilename = filenameMatch[1].replace(/['"]/g, '');
          // Extension vom Original-Dateinamen extrahieren
          const extensionMatch = originalFilename.match(/\.[^.]*$/);
          if (extensionMatch) {
            filename += extensionMatch[0];
          }
        }
      }

      // Download-Link erstellen
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;

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
}
