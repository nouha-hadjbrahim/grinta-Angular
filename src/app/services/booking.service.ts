import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {

  private API = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTerrains(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/terrains`);
  }

  getAvailableTimes(terrainId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.API}/bookings/available?terrainId=${terrainId}&date=${date}`
    );
  }
  getTerrainAvailability(date: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.API}/terrains/availability?date=${date}`);
}

  getMyBookings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/bookings/user/${userId}`);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.API}/bookings`, data);
  }

  updateBooking(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/bookings/${id}`, data);
  }

  // ✅ CANCEL soft (PATCH)
  cancelBooking(id: number): Observable<any> {
    return this.http.patch(`${this.API}/bookings/${id}/cancel`, {});
  }

  // DELETE gardé pour admin
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.API}/bookings/${id}`);
  }
}