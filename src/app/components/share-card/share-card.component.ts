import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaCard } from '../../models/mediacard.model';
import { MediacardService } from '../../services/mediacard.service';
import { ShareModalComponent } from '../share-modal/share-modal.component';

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

  constructor(public mediacardService: MediacardService) {}

  toggleShare(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showShareModal = !this.showShareModal;
  }
}
