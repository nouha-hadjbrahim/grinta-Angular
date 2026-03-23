import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private API = 'http://localhost:8000/api/payments';

  constructor(private http: HttpClient) {}

  initiatePayment(bookingId: number): Observable<any> {
    return this.http.post(`${this.API}/initiate/${bookingId}`, {});
  }

  verifyPayment(paymentId: string): Observable<any> {
    return this.http.get(`${this.API}/verify/${paymentId}`);
  }
}