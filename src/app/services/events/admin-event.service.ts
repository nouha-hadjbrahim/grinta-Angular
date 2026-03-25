import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrintaEvent } from './grinta-event.model';

@Injectable({
  providedIn: 'root'
})
export class AdminEventService {
  private adminApiUrl = 'http://localhost:8000/api/events/admin';
  private userApiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) {}

  // ========== ADMIN ENDPOINTS ==========
  
  getAllEvents(): Observable<GrintaEvent[]> {
    return this.http.get<GrintaEvent[]>(`${this.adminApiUrl}/all`);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }

  changeStatus(id: number, status: string): Observable<GrintaEvent> {
    return this.http.put<GrintaEvent>(`${this.adminApiUrl}/${id}/status?status=${status}`, {});
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.adminApiUrl}/stats`);
  }

  // ========== USER ENDPOINTS (utilisés par l'admin) ==========
  
  createEvent(event: GrintaEvent): Observable<GrintaEvent> {
    return this.http.post<GrintaEvent>(this.userApiUrl, event);
  }

  getEventById(id: number): Observable<GrintaEvent> {
    return this.http.get<GrintaEvent>(`${this.userApiUrl}/${id}`);
  }

  updateEvent(id: number, event: GrintaEvent): Observable<GrintaEvent> {
    return this.http.put<GrintaEvent>(`${this.userApiUrl}/${id}`, event);
  }
}