import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediacardService } from '../../services/mediacard.service';
import { MediaCard } from '../../models/mediacard.model';
import { ShareCardComponent } from '../../components/share-card/share-card.component';

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule, ShareCardComponent],
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  mediaCards: MediaCard[] = [];

  constructor(private mediacardService: MediacardService) {}

  ngOnInit() {
    this.loadMediaCards();
  }

  private loadMediaCards() {
    this.mediacardService.getMediaCards().subscribe({
      next: (cards) => {
        this.mediaCards = cards;
      },
      error: (error) => {
        console.error('Error loading media cards:', error);
      }
    });
  }
}
