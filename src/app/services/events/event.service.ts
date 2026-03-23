import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrintaEvent, GrintaEventTag, GrintaEventRegistration } from './grinta-event.model';

@Injectable({ providedIn: 'root' })
export class EventService {

  private apiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GrintaEvent[]> {
    return this.http.get<GrintaEvent[]>(this.apiUrl);
  }

  getById(id: number): Observable<GrintaEvent> {
    return this.http.get<GrintaEvent>(`${this.apiUrl}/${id}`);
  }

  create(event: GrintaEvent): Observable<GrintaEvent> {
    return this.http.post<GrintaEvent>(this.apiUrl, event);
  }

  update(id: number, event: GrintaEvent): Observable<GrintaEvent> {
    return this.http.put<GrintaEvent>(`${this.apiUrl}/${id}`, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addTag(eventId: number, tag: GrintaEventTag): Observable<GrintaEventTag> {
    return this.http.post<GrintaEventTag>(`${this.apiUrl}/${eventId}/tags`, tag);
  }

  deleteTag(tagId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}`);
  }

  register(eventId: number, userId: number): Observable<GrintaEventRegistration> {
    return this.http.post<GrintaEventRegistration>(
      `${this.apiUrl}/${eventId}/register?userId=${userId}`, {}
    );
  }

  getRegistrations(eventId: number): Observable<GrintaEventRegistration[]> {
    return this.http.get<GrintaEventRegistration[]>(
      `${this.apiUrl}/${eventId}/registrations`
    );
  }
}