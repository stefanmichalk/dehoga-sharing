import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function apiInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ API Error:', {
        url: request.url,
        status: error.status,
        statusText: error.statusText,
        error: error.error
      });
      return throwError(() => error);
    })
  );
}
