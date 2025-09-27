import { Component } from '@angular/core';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-settings',
  standalone: true,
  imports: [],
  template: `
    <button 
      (click)="openCookieSettings()" 
      class="text-gray-400 hover:text-orange-500 transition-colors text-sm">
      Cookie-Einstellungen
    </button>
  `
})
export class CookieSettingsComponent {
  constructor(private cookieConsentService: CookieConsentService) {}

  openCookieSettings(): void {
    this.cookieConsentService.openPreferences();
  }
}
