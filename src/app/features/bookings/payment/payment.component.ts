import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',   // ✅ pas compenent
  styleUrls: ['./payment.component.css']     // ✅ pas compenent
})
export class PaymentComponent implements OnInit {

  bookingId: number = 0;
  terrain: any = null;
  date: string = '';
  time: string = '';
  amount: number = 0;
  loading = false;

  constructor(
    private router: Router,
    private paymentService: PaymentService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;
    if (state) {
      this.bookingId = state['bookingId'];
      this.terrain   = state['terrain'];
      this.date      = state['date'];
      this.time      = state['time'];
      this.amount    = state['amount'];
    }
  }

  ngOnInit(): void {
    if (!this.bookingId) {
      this.router.navigate(['/main/bookings']);
    }
  }

  pay(): void {
    this.loading = true;
    this.paymentService.initiatePayment(this.bookingId).subscribe({
      next: (data: any) => {
        window.location.href = data.paymentUrl;
      },
      error: () => {
        this.loading = false;
        alert('❌ Erreur lors de l\'initiation du paiement');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/main/bookings']);
  }
}