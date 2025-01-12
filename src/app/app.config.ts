import { ApplicationConfig, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { MediacardService } from './services/mediacard.service';
import { PageService } from './services/page.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiInterceptor])
    ),
    provideMarkdown({
      sanitize: SecurityContext.NONE
    }),
    MediacardService,
    PageService
  ]
};
