import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During Server-Side Rendering (SSR), we might not have access to localStorage
  // For now, allow SSR to render the page, the browser will instantly re-evaluate
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Client-side authentication check
  if (authService.currentUser() && localStorage.getItem('dokqet_token')) {
    return true;
  }

  // Redirect to login page and clean up any dirty state
  authService.logout();
  return router.createUrlTree(['/login']);
};
