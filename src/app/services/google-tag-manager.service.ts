import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { CookieConsentService } from './cookie-consent.service';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleTagManagerService {
  private readonly GTM_ID = 'GTM-WF4K36GT';
  private isInitialized = false;
  private gtmLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private cookieConsentService: CookieConsentService
  ) {
    this.initialize();
  }

  private initialize(): void {
    if (isPlatformBrowser(this.platformId) && !this.isInitialized) {
      this.setupDataLayer();
      this.setupConsentListener();
      this.checkExistingConsent();
      this.isInitialized = true;
    }
  }

  private checkExistingConsent(): void {
    // Prüfen ob bereits ein gültiger Consent existiert
    const existingConsent = this.cookieConsentService.getCurrentConsent();
    if (existingConsent && existingConsent.analytics && !this.gtmLoaded) {
      this.loadGTMWithConsent(existingConsent);
    }
  }

  private setupDataLayer(): void {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  private setupConsentDefaults(): void {
    // Set default consent state
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 2000
    });

    // Configure GTM
    window.gtag('config', this.GTM_ID);
  }

  private loadGTM(): void {
    // Add GTM script to head
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.GTM_ID}`;
    
    // Add the GTM initialization script
    const initScript = this.document.createElement('script');
    initScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.GTM_ID}');
    `;
    
    const head = this.document.getElementsByTagName('head')[0];
    head.appendChild(initScript);
    head.appendChild(script);

    // Add noscript iframe to body
    const noscript = this.document.createElement('noscript');
    const iframe = this.document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${this.GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    
    noscript.appendChild(iframe);
    this.document.body.insertBefore(noscript, this.document.body.firstChild);
  }

  private setupConsentListener(): void {
    this.cookieConsentService.consent$.subscribe(consent => {
      if (consent && consent.analytics && !this.gtmLoaded) {
        this.loadGTMWithConsent(consent);
      } else if (consent && this.gtmLoaded) {
        this.updateConsentState(consent);
      }
    });
  }

  private loadGTMWithConsent(consent: any): void {
    this.setupConsentDefaults();
    this.loadGTM();
    this.gtmLoaded = true; // Flag setzen
    
    // Warten bis GTM geladen ist, dann Consent setzen
    setTimeout(() => {
      this.updateConsentState(consent);
    }, 100);
  }

  private updateConsentState(consent: any): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied'
      });
    }
  }

  // Method to track custom events
  public trackEvent(eventName: string, parameters: any = {}): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      // Only track if analytics consent is given
      const consent = this.cookieConsentService.getCurrentConsent();
      if (consent && consent.analytics) {
        window.gtag('event', eventName, parameters);
      }
    }
  }

  // Method to track page views
  public trackPageView(url: string, title?: string): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      const consent = this.cookieConsentService.getCurrentConsent();
      if (consent && consent.analytics) {
        window.gtag('config', this.GTM_ID, {
          page_path: url,
          page_title: title
        });
      }
    }
  }

  // Method to set custom dimensions
  public setCustomDimension(index: string, value: string): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      const consent = this.cookieConsentService.getCurrentConsent();
      if (consent && consent.analytics) {
        window.gtag('config', this.GTM_ID, {
          [`custom_map.dimension${index}`]: value
        });
      }
    }
  }

  // Method to track conversions
  public trackConversion(conversionId: string, conversionValue?: number): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      const consent = this.cookieConsentService.getCurrentConsent();
      if (consent && consent.marketing) {
        const parameters: any = { send_to: conversionId };
        if (conversionValue) {
          parameters.value = conversionValue;
          parameters.currency = 'EUR';
        }
        window.gtag('event', 'conversion', parameters);
      }
    }
  }
}
