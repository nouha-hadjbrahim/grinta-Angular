import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/User/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  terrains: any[] = [];
  times: string[] = [];
  myBookings: any[] = [];

  selectedTerrain: any = null;
  selectedDate: string = '';
  selectedTime: string = '';

  activeTab: 'book' | 'mybookings' | 'history' = 'book';
  editingId: number | null = null;

  showCancelModal = false;
  bookingToCancel: number | null = null;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  today: string = new Date().toISOString().split('T')[0];
  currentUserId: number = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId() ?? 0;
    this.loadTerrains();
    this.loadMyBookings();
  }

  // ✅ CORRECTION : My Bookings = PENDING + CONFIRMED
  get activeBookings(): any[] {
    return this.myBookings.filter(b => 
      b.status === 'CONFIRMED' || b.status === 'PENDING'
    );
  }

  // ✅ CORRECTION : Historique = CANCELLED uniquement
  get historyBookings(): any[] {
    return this.myBookings.filter(b => b.status === 'CANCELLED');
  }

  loadTerrains(): void {
    this.bookingService.getTerrains().subscribe(data => {
      this.terrains = data;
    });
  }

  loadMyBookings(): void {
    if (!this.currentUserId) return;
    this.bookingService.getMyBookings(this.currentUserId).subscribe(data => {
      this.myBookings = data;
    });
  }

  selectTerrain(t: any): void {
    if (this.getTerrainStatus(t) === 'full') {
      this.showToast('Ce terrain est complet !', 'error');
      return;
    }
    this.selectedTerrain = t;
    this.selectedTime = '';
    this.times = [];
    if (this.selectedDate) this.loadTimes();
  }

  onDateChange(): void {
    this.selectedTime = '';
    this.times = [];
    if (this.selectedTerrain && this.selectedDate) this.loadTimes();
  }

  loadTimes(): void {
    this.bookingService
      .getAvailableTimes(this.selectedTerrain.id, this.selectedDate)
      .subscribe(data => {
        const now = new Date();
        const isToday = this.selectedDate === this.today;
        this.times = data.filter(t => {
          if (!isToday) return true;
          const [h, m] = t.split(':').map(Number);
          return h > now.getHours() ||
                (h === now.getHours() && m > now.getMinutes());
        });
      });
  }

  confirmBooking(): void {
    if (!this.selectedTerrain || !this.selectedDate || !this.selectedTime) {
      this.showToast('Veuillez compléter toutes les étapes', 'error');
      return;
    }
    const payload = {
      user: { id: this.currentUserId },
      sportsTerrain: { id: this.selectedTerrain.id },
      date: this.selectedDate,
      time: this.selectedTime
    };
    this.bookingService.createBooking(payload).subscribe({
      next: (booking: any) => {
        // ✅ Naviguer vers la page paiement
        this.router.navigate(['/main/bookings/payment'], {
          state: {
            bookingId: booking.id,
            terrain: this.selectedTerrain,
            date: this.selectedDate,
            time: this.selectedTime,
            amount: this.subtotal + 5
          }
        });
      },
      error: (err: any) => {
        if (err.status === 409) {
          const msg = err.error?.error || 'Ce créneau est déjà réservé !';
          this.showToast('❌ ' + msg, 'error');
        } else {
          this.showToast('❌ Erreur lors de la réservation', 'error');
        }
      }
    });
  }

  startEdit(booking: any): void {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      this.showToast('❌ Impossible de modifier une réservation passée !', 'error');
      return;
    }
    this.editingId = booking.id;
    this.selectedTerrain = booking.sportsTerrain;
    this.selectedDate = booking.date;
    this.selectedTime = booking.time;
    this.activeTab = 'book';
    this.loadTimes();
  }

  saveEdit(): void {
    const payload = {
      user: { id: this.currentUserId },
      sportsTerrain: { id: this.selectedTerrain.id },
      date: this.selectedDate,
      time: this.selectedTime
    };
    this.bookingService.updateBooking(this.editingId!, payload).subscribe({
      next: () => {
        this.showToast('✅ Réservation modifiée !', 'success');
        this.resetForm();
        this.loadMyBookings();
      },
      error: (err: any) => {
        if (err.status === 409) {
          this.showToast('❌ Ce créneau est déjà réservé !', 'error');
        } else if (err.status === 400) {
          this.showToast('❌ Impossible de modifier une réservation passée !', 'error');
        } else {
          this.showToast('❌ Erreur lors de la modification', 'error');
        }
      }
    });
  }

  openCancelModal(id: number): void {
    this.bookingToCancel = id;
    this.showCancelModal = true;
  }

  confirmCancel(): void {
    if (!this.bookingToCancel) return;
    this.bookingService.cancelBooking(this.bookingToCancel).subscribe({
      next: () => {
        this.showCancelModal = false;
        this.bookingToCancel = null;
        this.showToast('Réservation annulée — visible dans Historique', 'success');
        this.loadTerrains();
        this.loadMyBookings();
      },
      error: () => {
        this.showToast('❌ Erreur lors de l\'annulation', 'error');
      }
    });
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.bookingToCancel = null;
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  resetForm(): void {
    this.selectedTerrain = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.times = [];
    this.editingId = null;
  }

  getTerrainStatus(terrain: any): 'available' | 'almost' | 'full' {
    const slots = terrain.availableSlots ?? terrain.capacity;
    const ratio = slots / terrain.capacity;
    if (slots <= 0) return 'full';
    if (ratio <= 0.3) return 'almost';
    return 'available';
  }

  getStatusLabel(terrain: any): string {
    const status = this.getTerrainStatus(terrain);
    const slots = terrain.availableSlots ?? terrain.capacity;
    if (status === 'full') return '🔴 Complet';
    if (status === 'almost') return `🟠 ${slots} place(s) restante(s)`;
    return `🟢 ${slots} place(s) disponible(s)`;
  }

  get subtotal(): number {
    return this.selectedTerrain?.price ?? 0;
  }

  get total(): string {
    return this.selectedTerrain ? (this.subtotal + 5) + ' TND' : '-';
  }
}