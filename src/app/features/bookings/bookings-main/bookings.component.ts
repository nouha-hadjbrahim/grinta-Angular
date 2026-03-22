import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  terrains: any[] = [];
  times: string[] = [];

  selectedTerrain: any = null;
  selectedDate: string = '';
  selectedTime: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getTerrains().subscribe((data: any[]) => {
      this.terrains = data;
    });
  }

  selectTerrain(t: any) {
    this.selectedTerrain = t;
  }

  confirmBooking() {
    if (!this.selectedTerrain || !this.selectedDate || !this.selectedTime) {
      alert('Fill all fields');
      return;
    }

    const booking = {
      user: { id: 1 },
      sportsTerrain: { id: this.selectedTerrain.id },
      date: this.selectedDate,
      time: this.selectedTime
    };

    this.bookingService.createBooking(booking).subscribe(() => {
      alert('Booking confirmed !');
    });
  }
}