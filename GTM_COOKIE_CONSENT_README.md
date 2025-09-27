# Google Tag Manager mit DSGVO-konformem Cookie Consent

## Überblick

Diese Implementierung stellt sicher, dass Google Tag Manager nur mit ausdrücklicher Zustimmung des Nutzers geladen wird und dabei allen DSGVO-Anforderungen entspricht.

## Funktionsweise

### 1. Cookie Consent Service (`cookie-consent.service.ts`)
- Verwaltet Cookie-Einwilligung und -Status
- Speichert Einstellungen im localStorage mit Ablaufzeit (30 Tage)
- Benachrichtigt andere Services über Änderungen

### 2. Cookie Banner (`cookie-consent-banner.component`)
- DSGVO-konforme Benutzeroberfläche
- Detaillierte Einstellungen für verschiedene Cookie-Kategorien
- Dunkles Design entsprechend dem Corporate Design

### 3. Google Tag Manager Service (`google-tag-manager.service.ts`)
- **Wichtig**: GTM wird NUR geladen, wenn Analytics-Consent erteilt wurde
- Setzt Consent-Status entsprechend der Nutzereinstellungen
- Stellt Methoden für Event-Tracking zur Verfügung

## DSGVO-Konformität

### ✅ Was wird richtig gemacht:
1. **Opt-In**: GTM lädt erst nach ausdrücklicher Zustimmung
2. **Granulare Kontrolle**: Unterscheidung zwischen notwendigen, Analytics- und Marketing-Cookies
3. **Consent-Management**: Dynamisches Laden und Aktualisieren der Consent-Stati
4. **Transparenz**: Klare Erklärung was welche Cookies tun
5. **Kontrolle**: Nutzer kann jederzeit Einstellungen ändern

### Cookie-Kategorien:
- **Notwendige Cookies**: Immer aktiv (Grundfunktionen)
- **Analyse-Cookies**: Nur mit Zustimmung (Google Analytics über GTM)
- **Marketing-Cookies**: Nur mit Zustimmung (Werbung, Tracking)

## Integration

### GTM Container ID: `GTM-WF4K36GT`

### Verwendung in Komponenten:

```typescript
import { GoogleTagManagerService } from './services/google-tag-manager.service';

constructor(private gtmService: GoogleTagManagerService) {}

// Event tracken
this.gtmService.trackEvent('button_click', {
  button_text: 'Download PDF',
  page_location: '/downloads'
});

// Page View tracken
this.gtmService.trackPageView('/new-page', 'New Page Title');
```

## Konfiguration im GTM Container

Nach der Implementierung sollten Sie in GTM folgende Einstellungen vornehmen:

1. **Consent Mode aktivieren**:
   - Gehen Sie zu Admin → Container-Einstellungen
   - Aktivieren Sie "Zusätzliche Consent-Einstellungen"

2. **Tags konfigurieren**:
   - Alle Analytics-Tags: Triggern nur bei `analytics_storage = granted`
   - Alle Marketing-Tags: Triggern nur bei `ad_storage = granted`

3. **Built-in Variables**:
   - Aktivieren Sie "Consent State" Variablen

## Testing

Um die Implementierung zu testen:

1. **Devtools öffnen** → Network Tab
2. **Seite laden** → Kein GTM-Request sollte sichtbar sein
3. **"Alle akzeptieren" klicken** → GTM sollte jetzt laden
4. **Console prüfen**: `dataLayer` sollte Consent Events enthalten

```javascript
// In der Browser-Console:
console.log(window.dataLayer);
// Sollte consent-Events zeigen
```

## Weitere GTM-Integration

Für die Meta Pixel und andere Tracking-Tools:

1. **Im GTM Container** → Tags hinzufügen
2. **Trigger konfigurieren**: Nur bei entsprechendem Consent
3. **Variables verwenden**: Consent-State für bedingte Logik

## Support

Bei Fragen zur Implementierung oder weiteren Konfiguration können Sie sich an das Entwicklungsteam wenden.

---
**Wichtig**: Diese Implementierung ist DSGVO-konform, solange die GTM-Container-Konfiguration ebenfalls entsprechend eingerichtet wird.
