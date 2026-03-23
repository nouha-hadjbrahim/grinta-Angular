import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

export interface User {
  id?: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  photo?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user/users`;
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/sign-in`, { email, password }).pipe(
      tap(response => {
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
      })
    );
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/sign-up`, registerData);
  }

  getAll(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // New methods for User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, formData);
  }
}

