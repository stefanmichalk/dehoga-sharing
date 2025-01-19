import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Download, DownloadType } from '../../interfaces/download.interface';
import { DownloadsService } from '../../services/downloads.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
  providers: [DownloadsService]
})
export class DownloadsComponent implements OnInit {
  downloads: Download[] = [];
  filteredDownloads: Download[] = [];
  availableTags: string[] = [];
  selectedTags: string[] = [];
  selectedCategory: string = 'all';
  loading = true;
  error: string | null = null;

  public categories: { type: string; label: string }[];

  constructor(private downloadsService: DownloadsService) {
    this.categories = [
      { type: 'card', label: 'Social Media Kacheln' },
      { type: 'poster', label: 'Poster' },
      { type: 'postcard', label: 'Postkarten' },
      { type: 'file', label: 'Dokumente' },
      { type: 'video', label: 'Videos' },
    ];
  }

  ngOnInit(): void {
    this.loadDownloads();
  }

  private loadDownloads(): void {
    this.loading = true;
    this.error = null;

    this.downloadsService.getDownloads().subscribe({
      next: (downloads) => {
        this.downloads = downloads;

        // Initialize tags
        this.availableTags = this.getAllUniqueTags(downloads);

        // Initialize filtered downloads
        this.filteredDownloads = [...downloads];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading downloads:', error);
        this.error = 'Fehler beim Laden der Downloads. Bitte versuchen Sie es später erneut.';
        this.loading = false;
      }
    });
  }

  private getAllUniqueTags(downloads: Download[]): string[] {
    const tagsSet = new Set<string>();

    downloads.forEach(download => {
      if (download.tags && Array.isArray(download.tags)) {
        download.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagsSet.add(tag.trim());
          }
        });
      }
    });

    const sortedTags = Array.from(tagsSet).sort();
    return sortedTags;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  toggleTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = [];
    } else {
      this.selectedTags = [tag];
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.downloads];

    // Tag-Filter anwenden
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(download =>
        download.tags?.some(tag => this.selectedTags.includes(tag))
      );
    }

    // Kategorie-Filter anwenden
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(download => {
        return download.type === this.selectedCategory;
      });
    }

    this.filteredDownloads = filtered;
  }

  getPreviewUrl(download: Download): string {
    if (['card', 'poster', 'postcard'].includes(download.type) || !download.preview) {
      return this.downloadsService.getFileUrl(download.file, {
        isPreview: true,
        type: download.type
      }) || '';
    }

    return this.downloadsService.getFileUrl(download.preview) || '';
  }

  getFileUrl(fileId: string | null): string {
    return this.downloadsService.getFileUrl(fileId) || '';
  }

  getTagsForDownload(download: Download): string[] {
    return download.tags && Array.isArray(download.tags) ? download.tags : [];
  }

  async downloadFile(download: Download): Promise<void> {
    try {
      await this.downloadsService.downloadFile(download);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
}
