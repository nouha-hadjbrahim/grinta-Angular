import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'auth_token';
  private USER_ID_KEY = 'auth_user_id';
  private USER_EMAIL_KEY = 'auth_user_email';
  private USER_KEY = 'auth_user';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.getUser();
    return user?.role === 'USER';
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  }

  clearAuth(): void {
    this.logout();
  }

  setUserData(id: number, email: string): void {
    localStorage.setItem(this.USER_ID_KEY, id.toString());
    localStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem(this.USER_ID_KEY);
    if (id) return parseInt(id, 10);
    const user = this.getUser();
    return user?.id || null;
  }

  getCurrentUserEmail(): string | null {
    const email = localStorage.getItem(this.USER_EMAIL_KEY);
    if (email) return email;
    const user = this.getUser();
    return user?.email || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
