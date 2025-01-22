import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaCard } from '../../models/mediacard.model';
import { MediacardService } from '../../services/mediacard.service';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-share-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ShareModalComponent],
  templateUrl: './share-card.component.html',
  styleUrls: ['./share-card.component.css']
})
export class ShareCardComponent {
  @Input() card!: MediaCard;
  showShareModal = false;

  constructor(
    public mediacardService: MediacardService,
    private toastService: ToastService
  ) {}

  playVideo(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.card.videoPlayUrl) {
      window.open(this.card.videoPlayUrl, '_blank');
    }
  }

  copyTag(tag: string) {
    navigator.clipboard.writeText(`#${tag}`).then(() => {
      this.toastService.show(`#${tag} in die Zwischenablage kopiert`, 'success', 2000);
    }).catch(() => {
      this.toastService.show('Fehler beim Kopieren', 'error');
    });
  }

  copyAllTags() {
    if (this.card.tags?.length) {
      const allTags = this.card.tags.map(tag => `#${tag}`).join(' ');
      navigator.clipboard.writeText(allTags).then(() => {
        this.toastService.show(`${this.card.tags!.length} Hashtags in die Zwischenablage kopiert`, 'success', 2000);
      }).catch(() => {
        this.toastService.show('Fehler beim Kopieren', 'error');
      });
    }
  }

  toggleShare(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showShareModal = !this.showShareModal;
  }

  downloadImage() {
    if (this.card.image) {
      // Show initial toast
      this.toastService.show('Download wird gestartet...', 'info', 1500);

      // Create promises for both operations
      const copyPromise = this.card.description 
        ? navigator.clipboard.writeText(this.card.description)
        : Promise.resolve();

      const downloadPromise = fetch(this.mediacardService.getImageUrl(this.card.image))
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.card.title}.jpg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });

      // Wait for both operations to complete
      Promise.all([copyPromise, downloadPromise])
        .then(() => {
          const message = this.card.description
            ? 'Bild wurde heruntergeladen und Text in die Zwischenablage kopiert'
            : 'Bild wurde heruntergeladen';
          this.toastService.show(message, 'success');
        })
        .catch(() => {
          this.toastService.show('Ein Fehler ist aufgetreten', 'error');
        });
    }
  }
}
