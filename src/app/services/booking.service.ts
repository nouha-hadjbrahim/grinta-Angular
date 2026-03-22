import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private API = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTerrains(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/terrains`);
  }

  createBooking(data: any) {
    return this.http.post(`${this.API}/bookings`, data);
  }
}