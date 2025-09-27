import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieConsentService } from '../../services/cookie-consent.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss'
})
export class CookieConsentBannerComponent implements OnInit, OnDestroy {
  showBanner = false;
  showDetails = false;
  
  private destroy$ = new Subject<void>();

  constructor(private cookieConsentService: CookieConsentService) {}

  ngOnInit(): void {
    this.cookieConsentService.showBanner$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        this.showBanner = show;
        this.showDetails = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  acceptAll(): void {
    this.cookieConsentService.acceptAll();
  }

  acceptNecessary(): void {
    this.cookieConsentService.acceptNecessaryOnly();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  savePreferences(): void {
    const analyticsCheckbox = document.getElementById('analytics') as HTMLInputElement;
    const marketingCheckbox = document.getElementById('marketing') as HTMLInputElement;
    
    this.cookieConsentService.saveConsent({
      analytics: analyticsCheckbox?.checked || false,
      marketing: marketingCheckbox?.checked || false
    });
  }
}
