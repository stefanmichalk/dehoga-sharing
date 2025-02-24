import {AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ElementRef} from '@angular/core';
import {CommonModule, DOCUMENT, isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {MediaCard} from '../../models/mediacard.model';
import {MediacardService} from '../../services/mediacard.service';
import {ShareButtonsComponent} from '../../components/share-buttons/share-buttons.component';
import {Meta, Title, DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, RouterModule, ShareButtonsComponent, MarkdownModule],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit, OnDestroy, AfterViewInit {
  card: MediaCard | null = null;
  error: string | null = null;
  showMobileBackButton = false;
  parallaxOffset = 0;
  sidebarPosition = {top: '0px', left: '0px'};
  isPositionCalculated = false;
  private isBrowser: boolean;
  private observer: MutationObserver | null = null;
  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser) {
      this.parallaxOffset = window.scrollY * 0.5;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.calculateSidebarPosition();
    }
  }

  constructor(
    private route: ActivatedRoute,
    public mediacardService: MediacardService,
    private meta: Meta,
    private title: Title,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Keine ID gefunden';
      return;
    }

    this.loadCard(id);

    if (this.isBrowser) {
      window.addEventListener('resize', this.checkIfMobile.bind(this));
      this.checkIfMobile();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.checkIfMobile.bind(this));
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Wait for banner image to load
      const bannerImage = document.querySelector('.banner-image') as HTMLImageElement;
      if (bannerImage) {
        if (bannerImage.complete) {
          this.onImageLoaded();
        } else {
          bannerImage.addEventListener('load', () => this.onImageLoaded());
        }
      } else {
        // No banner image, calculate position directly
        this.onImageLoaded();
      }
    }
  }

  private onImageLoaded() {
    // Force layout recalculation
    window.dispatchEvent(new Event('resize'));

    // Initial calculation after resize
    requestAnimationFrame(() => {
      this.calculateSidebarPosition();

      // Double check after a short delay
      setTimeout(() => {
        this.calculateSidebarPosition();
        this.isPositionCalculated = true;
      }, 100);
    });

    // Set up mutation observer to watch for content changes
    const contentArea = document.querySelector('.lg\\:col-span-2');
    if (contentArea) {
      this.observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          this.calculateSidebarPosition();
        });
      });

      this.observer.observe(contentArea, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  private loadCard(id: string) {
    this.mediacardService.getMediaCard(id).subscribe({
      next: (card) => {
        this.card = card;
        this.error = null;
        if (card) {
          this.updateMetaTags();
        }
      },
      error: (error) => {
        console.error('Error loading card:', error);
        this.error = 'Fehler beim Laden der Karte';
      }
    });
  }

  private checkIfMobile() {
    if (!this.isBrowser) return;
    this.showMobileBackButton = window.innerWidth < 768;
  }

  private calculateSidebarPosition() {
    if (!this.isBrowser) return;

    const contentCol = document.querySelector('.lg\\:col-span-2');
    if (!contentCol) return;

    requestAnimationFrame(() => {
      const rect = contentCol.getBoundingClientRect();
      const top = rect.top + window.scrollY - 128;
      const left = rect.right + 32;

      this.sidebarPosition = {
        top: `${top}px`,
        left: `${left}px`
      };

      this.isPositionCalculated = true;
    });
  }

  private updateMetaTags() {
    if (!this.card) return;


    const currentUrl = this.document.location.href;
    const imageUrl = this.card.imageUrl;
    //this.card.image
    //? `https://dehoga-campaign.directus.app/assets/${this.card.image}/banner.jpg`
    //: '';

    // Standard Meta Tags
    this.title.setTitle(this.card.title || 'DEHOGA Kampagne');
    this.meta.updateTag({name: 'description', content: this.card.description || ''});

    // Open Graph
    this.meta.updateTag({property: 'og:url:secure_url', content: currentUrl});
    this.meta.updateTag({property: 'og:title', content: this.card.title || 'DEHOGA Kampagne'});
    this.meta.updateTag({property: 'og:description', content: this.card.description || ''});
    this.meta.updateTag({property: 'og:type', content: 'article'});
    if (imageUrl) {
      this.meta.updateTag({property: 'og:image', content: imageUrl});
    }

    // Twitter Card
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:title', content: this.card.title || 'DEHOGA Kampagne'});
    this.meta.updateTag({name: 'twitter:description', content: this.card.description || ''});
    if (imageUrl) {
      this.meta.updateTag({name: 'twitter:image', content: imageUrl});
    }
  }

  getImageUrl(path: string): string {
    return this.mediacardService.getImageUrl(path);
  }
}
