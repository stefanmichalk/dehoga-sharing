import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
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
        this.title.setTitle('damit Alle gewinnen');
        this.meta.updateTag({ name: 'description', content: 'damit Alle gewinnen' });
        this.meta.updateTag({ property: 'og:title', content: 'damit Alle gewinnen' });
        this.meta.updateTag({ property: 'og:description', content: 'damit Alle gewinnen' });
        this.meta.removeTag("property='og:image'");
      }
    });
  }
}
