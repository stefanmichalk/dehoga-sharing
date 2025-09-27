import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly STORAGE_KEY = 'cookie-consent';
  private readonly CONSENT_VERSION = '1.0';
  
  private consentSubject = new BehaviorSubject<CookieConsent | null>(null);
  public consent$ = this.consentSubject.asObservable();
  
  private showBannerSubject = new BehaviorSubject<boolean>(false);
  public showBanner$ = this.showBannerSubject.asObservable();

  constructor() {
    this.loadConsent();
  }

  private loadConsent(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if consent is still valid (30 days)
        const isValid = Date.now() - parsed.timestamp < 30 * 24 * 60 * 60 * 1000;
        
        if (isValid && parsed.version === this.CONSENT_VERSION) {
          this.consentSubject.next(parsed.consent);
          return;
        }
      }
    } catch (error) {
      console.warn('Error loading cookie consent:', error);
    }
    
    // Show banner if no valid consent
    this.showBannerSubject.next(true);
  }

  public saveConsent(consent: Partial<CookieConsent>): void {
    const fullConsent: CookieConsent = {
      necessary: true, // Always required
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        consent: fullConsent,
        version: this.CONSENT_VERSION,
        timestamp: Date.now()
      }));
      
      this.consentSubject.next(fullConsent);
      this.showBannerSubject.next(false);
      
      // Update GTM consent
      this.updateGTMConsent(fullConsent);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }

  public acceptAll(): void {
    this.saveConsent({
      analytics: true,
      marketing: true
    });
  }

  public acceptNecessaryOnly(): void {
    this.saveConsent({
      analytics: false,
      marketing: false
    });
  }

  public getCurrentConsent(): CookieConsent | null {
    return this.consentSubject.getValue();
  }

  public hasConsent(type: keyof CookieConsent): boolean {
    const consent = this.getCurrentConsent();
    return consent ? Boolean(consent[type]) : false;
  }

  public resetConsent(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.consentSubject.next(null);
    this.showBannerSubject.next(true);
  }

  private updateGTMConsent(consent: CookieConsent): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }
  }

  public openPreferences(): void {
    this.showBannerSubject.next(true);
  }
}
