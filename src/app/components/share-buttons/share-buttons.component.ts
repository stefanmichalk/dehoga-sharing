import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingService } from '../../services/sharing.service';
import { SharingButton } from '../../models/sharing.model';

@Component({
  selector: 'app-share-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-3">
      <button *ngFor="let button of sharingButtons"
              (click)="share(button)"
              [style.background-color]="button.color"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors hover:opacity-90 text-white"
              [attr.aria-label]="'Share on ' + button.name">
        <span class="text-sm font-medium">{{ button.label }}</span>
      </button>
      <div *ngIf="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <div *ngIf="!error && sharingButtons.length === 0" class="text-gray-500 text-sm">
        Keine Share-Buttons verfügbar
      </div>
    </div>
  `
})
export class ShareButtonsComponent implements OnInit {
  @Input() cardId!: string;
  @Input() title!: string;

  sharingButtons: SharingButton[] = [];
  error: string | null = null;

  constructor(private sharingService: SharingService) {
  }

  ngOnInit() {
    this.sharingService.getSharingButtons().subscribe({
      next: (buttons) => {
        this.sharingButtons = buttons;
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading sharing buttons:', error);
        this.error = 'Fehler beim Laden der Share-Buttons';
        this.sharingButtons = [];
      }
    });
  }

  share(button: SharingButton) {
    const shareUrl = this.sharingService.getButtonUrl(button, this.cardId, this.title);
    window.open(shareUrl, '_blank');
  }
}
