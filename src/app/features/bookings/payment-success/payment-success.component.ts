import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  receipt: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const paymentId = this.route.snapshot.queryParamMap.get('payment_id');
    if (!paymentId) {
      this.router.navigate(['/main/bookings']);
      return;
    }
    this.paymentService.verifyPayment(paymentId).subscribe({
      next: (data: any) => {
        this.receipt = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/main/bookings']);
  }

  printReceipt(): void {
    window.print();
  }
}