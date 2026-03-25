import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminEventService } from '../../../services/events/admin-event.service';
import { AuthService } from '../../../services/User/auth.service';

interface GrintaEventTag {
  id?: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-event-detail-admin',
  templateUrl: './event-detail-admin.component.html',
  styleUrls: ['./event-detail-admin.component.css']
})
export class EventDetailAdminComponent implements OnInit {

  event: any = null;
  registrations: any[] = [];
  eventId!: number;
  loading = false;
  activeTab: 'info' | 'participants' | 'tags' = 'info';

  get currentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminEventService: AdminEventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
    this.loadRegistrations();
  }

  loadEvent(): void {
    this.loading = true;
    this.adminEventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
        console.log('Event loaded:', this.event);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        alert('Événement introuvable');
        this.loading = false;
      }
    });
  }

  loadRegistrations(): void {
    this.adminEventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.registrations = data.registrations || [];
        console.log('Registrations:', this.registrations);
      },
      error: (err) => {
        console.error('Error loading registrations:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'UPCOMING':  'badge-upcoming',
      'ONGOING':   'badge-ongoing',
      'COMPLETED': 'badge-completed',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'UPCOMING':  'À venir',
      'ONGOING':   'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé'
    };
    return map[status] || status;
  }

  getProgressPercent(): number {
    if (!this.event?.maxParticipants) return 0;
    return Math.min((this.registrations.length / this.event.maxParticipants) * 100, 100);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  goBack(): void {
    this.router.navigate(['/admin/events']);
  }

  goToEdit(): void {
    this.router.navigate(['/admin/events/edit', this.eventId]);
  }

  deleteEvent(): void {
    if (confirm(`Supprimer définitivement l'événement "${this.event?.title}" ?`)) {
      this.adminEventService.deleteEvent(this.eventId).subscribe({
        next: () => {
          alert('Événement supprimé !');
          this.router.navigate(['/admin/events']);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  changeStatus(newStatus: string): void {
    if (confirm(`Changer le statut de "${this.event?.title}" en ${this.getStatusLabel(newStatus)} ?`)) {
      this.adminEventService.changeStatus(this.eventId, newStatus).subscribe({
        next: () => {
          alert('Statut modifié !');
          this.loadEvent();
        },
        error: (err) => {
          console.error('Error changing status:', err);
          alert('Erreur lors du changement de statut');
        }
      });
    }
  }

  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }
}