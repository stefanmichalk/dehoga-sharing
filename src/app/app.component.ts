import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { CookieConsentBannerComponent } from './components/cookie-consent-banner/cookie-consent-banner.component';
import { GoogleTagManagerService } from './services/google-tag-manager.service';
import { CookieConsentService } from './services/cookie-consent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, CookieConsentBannerComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-screen bg-gray-50">
      <div class="mx-auto px-0 sm:px-12 lg:px-16 max-w-[1400px]">
        <router-outlet></router-outlet>
      </div>
    </main>
    <app-footer></app-footer>
    <app-toast></app-toast>
    <app-cookie-consent-banner></app-cookie-consent-banner>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
    private gtmService: GoogleTagManagerService,
    private cookieConsentService: CookieConsentService
  ) {}

  ngOnInit() {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Scroll to top on every route change (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      
      // Reset meta tags when navigating to home page
      if (event.url === '/') {
        this.title.setTitle('damit ALLE gewinnen');
        this.meta.updateTag({ name: 'description', content: 'damit ALLE gewinnen' });
        this.meta.updateTag({ property: 'og:title', content: 'damit ALLE gewinnen' });
        this.meta.updateTag({ property: 'og:description', content: 'Zeit für echte Lösungen - damit ALLE gewinnen' });
        this.meta.updateTag({ property: 'og:image', content: 'https://dehoga.four-lines.de/main.jpg' });

        // twitter
        this.meta.updateTag({ name: 'twitter:title', content: 'damit ALLE gewinnen' });
        this.meta.updateTag({ name: 'twitter:description', content: 'Zeit für echte Lösungen - damit ALLE gewinnen' });
        this.meta.updateTag({ name: 'twitter:image', content: 'https://dehoga.four-lines.de/main.jpg' });
      }
    });
  }
}
