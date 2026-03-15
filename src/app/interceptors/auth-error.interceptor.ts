import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the response is one of the authorization errors
      if (error.status === 401 || error.status === 403) {
        
        // Clear all persistent storage (token and user data) and the internal signals
        authService.logout();
        
        // Notify the user about the session expiration
        toastService.warning('Tu sesión de Dokqet ha expirado. Por seguridad, por favor vuelve a iniciar sesión.');

        // Redirect safely back to the landing page
        router.navigate(['/']);
      }
      
      // Re-throw the error so it can be handled by local component services if needed
      return throwError(() => error);
    })
  );
};
