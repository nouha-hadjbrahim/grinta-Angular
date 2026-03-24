import { Component, OnInit } from '@angular/core';
import { AdminBookingService, AdminBookingDTO } from '../../services/admin-booking.service';
@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {

  bookings: AdminBookingDTO[] = [];
  filteredBookings: AdminBookingDTO[] = [];
  
  // Filtres
  selectedStatus: string = 'ALL';
  selectedDate: string = '';
  searchTerm: string = '';
  
  // Modals
  showApproveModal = false;
  showRejectModal = false;
  showCancelModal = false;
  showDeleteModal = false;
  selectedBooking: AdminBookingDTO | null = null;
  
  // Toast
  toast: { message: string; type: 'success' | 'error' } | null = null;
  
  // Loading
  loading = false;

  constructor(private adminBookingService: AdminBookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  /**
   * Charger toutes les réservations
   */
  loadBookings(): void {
    this.loading = true;
    this.adminBookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.showToast('❌ Erreur lors du chargement', 'error');
        this.loading = false;
      }
    });
  }

  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    let result = [...this.bookings];

    // Filtre par statut
    if (this.selectedStatus !== 'ALL') {
      result = result.filter(b => b.status === this.selectedStatus);
    }

    // Filtre par date
    if (this.selectedDate) {
      result = result.filter(b => b.date === this.selectedDate);
    }

    // Filtre par recherche (nom user, terrain, email)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(b =>
        b.userName.toLowerCase().includes(term) ||
        b.userEmail.toLowerCase().includes(term) ||
        b.terrainName.toLowerCase().includes(term) ||
        b.bookingReference.toLowerCase().includes(term)
      );
    }

    this.filteredBookings = result;
  }

  /**
   * Changer le filtre de statut
   */
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  /**
   * Recherche
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Filtre par date
   */
  onDateFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Reset filtres
   */
  resetFilters(): void {
    this.selectedStatus = 'ALL';
    this.selectedDate = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  // ==================== MODALS ====================

  openApproveModal(booking: AdminBookingDTO): void {
    this.selectedBooking = booking;
    this.showApproveModal = true;
  }

  openRejectModal(booking: AdminBookingDTO): void {
    this.selectedBooking = booking;
    this.showRejectModal = true;
  }

  openCancelModal(booking: AdminBookingDTO): void {
    this.selectedBooking = booking;
    this.showCancelModal = true;
  }

  openDeleteModal(booking: AdminBookingDTO): void {
    this.selectedBooking = booking;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showApproveModal = false;
    this.showRejectModal = false;
    this.showCancelModal = false;
    this.showDeleteModal = false;
    this.selectedBooking = null;
  }

  // ==================== ACTIONS ====================

  /**
   * Approuver une réservation
   */
  confirmApprove(): void {
    if (!this.selectedBooking) return;
    
    this.adminBookingService.approveBooking(this.selectedBooking.id).subscribe({
      next: () => {
        this.showToast('✅ Réservation approuvée !', 'success');
        this.closeModals();
        this.loadBookings();
      },
      error: (err) => {
        const msg = err.error?.error || 'Erreur lors de l\'approbation';
        this.showToast('❌ ' + msg, 'error');
      }
    });
  }

  /**
   * Rejeter une réservation
   */
  confirmReject(): void {
    if (!this.selectedBooking) return;
    
    this.adminBookingService.rejectBooking(this.selectedBooking.id).subscribe({
      next: () => {
        this.showToast('✅ Réservation rejetée', 'success');
        this.closeModals();
        this.loadBookings();
      },
      error: () => {
        this.showToast('❌ Erreur lors du rejet', 'error');
      }
    });
  }

  /**
   * Annuler une réservation confirmée
   */
  confirmCancel(): void {
    if (!this.selectedBooking) return;
    
    this.adminBookingService.cancelBooking(this.selectedBooking.id).subscribe({
      next: () => {
        this.showToast('✅ Réservation annulée', 'success');
        this.closeModals();
        this.loadBookings();
      },
      error: () => {
        this.showToast('❌ Erreur lors de l\'annulation', 'error');
      }
    });
  }

  /**
   * Supprimer définitivement
   */
  confirmDelete(): void {
    if (!this.selectedBooking) return;
    
    this.adminBookingService.deleteBooking(this.selectedBooking.id).subscribe({
      next: () => {
        this.showToast('✅ Réservation supprimée', 'success');
        this.closeModals();
        this.loadBookings();
      },
      error: () => {
        this.showToast('❌ Erreur lors de la suppression', 'error');
      }
    });
  }

  // ==================== HELPERS ====================

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'CONFIRMED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳ En attente';
      case 'CONFIRMED': return '✅ Confirmée';
      case 'CANCELLED': return '❌ Annulée';
      default: return status;
    }
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  get pendingCount(): number {
    return this.bookings.filter(b => b.status === 'PENDING').length;
  }

  get confirmedCount(): number {
    return this.bookings.filter(b => b.status === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(b => b.status === 'CANCELLED').length;
  }
}