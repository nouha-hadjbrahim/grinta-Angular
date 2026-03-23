import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'auth_user';

  constructor(private router: Router) {}

  /**
   * Store authentication token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get authentication token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store user object in localStorage
   */
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user object from localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get user role from localStorage
   */
  getRole(): 'ADMIN' | 'USER' | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  /**
   * Check if user is regular user
   */
  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  /**
   * Get user email
   */
  getUserEmail(): string | null {
    const user = this.getUser();
    return user ? user.email : null;
  }

  /**
   * Clear authentication and redirect to sign-in
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/sign-in']);
  }

  /**
   * Clear all authentication data without redirect
   */
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if JWT token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return true; // Invalid token format
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      return true; // If decoding fails, consider token expired
    }
  }
}
