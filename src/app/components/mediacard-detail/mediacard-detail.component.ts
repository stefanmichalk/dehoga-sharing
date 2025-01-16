import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MediaCard } from '../../models/mediacard.model';
import { MediacardService } from '../../services/mediacard.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mediacard-detail',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './mediacard-detail.component.html',
  styleUrls: ['./mediacard-detail.component.css']
})
export class MediacardDetailComponent implements OnInit, OnChanges {
  @Input() card!: MediaCard;

  constructor(
    public mediacardService: MediacardService,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.updateMetaTags();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card'] && !changes['card'].firstChange) {
      this.updateMetaTags();
    }
  }

  private updateMetaTags() {
    if (!this.card) return;

    const imageUrl = this.mediacardService.getImageUrl(this.card.image) + '.jpg';
    const currentUrl = this.document.location.href;

    // Standard Meta Tags
    this.title.setTitle(this.card.title);
    this.meta.updateTag({ name: 'description', content: this.card.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: this.card.title });
    this.meta.updateTag({ property: 'og:description', content: this.card.description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    //this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.card.title });
    this.meta.updateTag({ name: 'twitter:description', content: this.card.description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }
}
