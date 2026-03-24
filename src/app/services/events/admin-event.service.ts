import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrintaEvent } from './grinta-event.model';

@Injectable({
  providedIn: 'root'
})
export class AdminEventService {
  // ✅ Correction : utiliser /api/events/admin au lieu de /api/admin/events
  private apiUrl = 'http://localhost:8000/api/events/admin';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<GrintaEvent[]> {
    return this.http.get<GrintaEvent[]>(`${this.apiUrl}/all`);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeStatus(id: number, status: string): Observable<GrintaEvent> {
    return this.http.put<GrintaEvent>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}