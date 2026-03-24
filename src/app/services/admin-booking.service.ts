import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminBookingDTO {
  id: number;
  date: string;
  time: string;
  status: string;
  userId: number;
  userName: string;
  userEmail: string;
  terrainId: number;
  terrainName: string;
  terrainType: string;
  terrainLocation: string;
  price: number;
  bookingReference: string;
}

export interface DashboardStatsDTO {
  totalBookingsToday: number;
  pendingApprovals: number;
  revenueThisMonth: number;
  mostBookedTerrain: string;
  occupancyRate: number;
  bookingsByDay: { [key: string]: number };
  bookingsByTerrain: { [key: string]: number };
  revenueByMonth: { [key: string]: number };
  bookingsByStatus: { [key: string]: number };
}

@Injectable({ providedIn: 'root' })
export class AdminBookingService {

  private API = 'http://localhost:8000/api/admin/bookings';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les réservations
   */
  getAllBookings(): Observable<AdminBookingDTO[]> {
    return this.http.get<AdminBookingDTO[]>(this.API);
  }

  /**
   * Filtrer par statut
   */
  getBookingsByStatus(status: string): Observable<AdminBookingDTO[]> {
    return this.http.get<AdminBookingDTO[]>(`${this.API}/status/${status}`);
  }

  /**
   * Filtrer par date
   */
  getBookingsByDate(date: string): Observable<AdminBookingDTO[]> {
    return this.http.get<AdminBookingDTO[]>(`${this.API}/date/${date}`);
  }

  /**
   * Approuver une réservation
   */
  approveBooking(id: number): Observable<AdminBookingDTO> {
    return this.http.put<AdminBookingDTO>(`${this.API}/${id}/approve`, {});
  }

  /**
   * Rejeter une réservation
   */
  rejectBooking(id: number): Observable<AdminBookingDTO> {
    return this.http.put<AdminBookingDTO>(`${this.API}/${id}/reject`, {});
  }

  /**
   * Annuler une réservation confirmée
   */
  cancelBooking(id: number): Observable<AdminBookingDTO> {
    return this.http.put<AdminBookingDTO>(`${this.API}/${id}/cancel`, {});
  }

  /**
   * Modifier une réservation
   */
  updateBooking(id: number, data: any): Observable<AdminBookingDTO> {
    return this.http.put<AdminBookingDTO>(`${this.API}/${id}`, data);
  }

  /**
   * Supprimer définitivement
   */
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  /**
   * Statistiques dashboard
   */
  getDashboardStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.API}/stats`);
  }
}