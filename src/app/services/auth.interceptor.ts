import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      // Check if token is expired
      if (this.authService.isTokenExpired(token)) {
        this.authService.clearAuth();
        this.router.navigate(['/sign-in']);
        return throwError(() => new Error('Token expired. Please login again.'));
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 403 Forbidden - likely token issue
        if (error.status === 403) {
          this.authService.clearAuth();
          this.router.navigate(['/sign-in']);
          return throwError(() => new Error('Unauthorized. Please login again.'));
        }
        return throwError(() => error);
      })
    );
  }
}
