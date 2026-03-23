import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Guard to check if user has ADMIN role
   * Allows access only to admins, redirects others to home
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // Not logged in, redirect to sign-in
      this.router.navigate(['/sign-in']);
      return false;
    }

    if (this.authService.isAdmin()) {
      // User is admin, allow access
      return true;
    }

    // User is not admin, redirect to home
    this.router.navigate(['/main']);
    return false;
  }
}
