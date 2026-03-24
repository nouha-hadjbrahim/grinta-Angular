import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent, GrintaEventRegistration } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  event: GrintaEvent | null = null;
  registrations: GrintaEventRegistration[] = [];
  eventId!: number;
  loading = false;

  get currentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loadRegistrations();
      },
      error: () => {
        alert('Event introuvable');
        this.loading = false;
      }
    });
  }

  loadRegistrations(): void {
    this.eventService.getRegistrations(this.eventId).subscribe({
      next: (data) => {
        this.registrations = data;
        // ✅ Ajoute les registrations à l'événement (comme dans events)
        if (this.event) {
          this.event.registrations = data;
        }
        this.loading = false;
        console.log('Registrations loaded:', this.registrations);
      },
      error: (err) => {
        console.error('Error loading registrations:', err);
        this.loading = false;
      }
    });
  }

  // ✅ MÊME LOGIQUE QUE DANS EVENTS.COMPONENT.TS
  isUserRegistered(): boolean {
    const userId = this.currentUserId;
    if (!userId || !this.event?.registrations) return false;
    
    return this.event.registrations.some(reg => {
      if (reg.userId) {
        return reg.userId === userId;
      }
      if (reg.user && reg.user.id) {
        return reg.user.id === userId;
      }
      return false;
    });
  }

  register(): void {
    const userId = this.currentUserId;
    
    if (!userId) { 
      alert('Vous devez être connecté !'); 
      return; 
    }
    
    if (this.isUserRegistered()) {
      alert('Vous êtes déjà inscrit à cet événement !');
      return;
    }
    
    if (this.isFullEvent()) {
      alert('Cet événement est complet !');
      return;
    }
    
    this.eventService.register(this.eventId, userId).subscribe({
      next: (registration) => {
        alert('Inscription réussie !');
        // ✅ Mise à jour locale comme dans events
        if (this.event) {
          if (!this.event.registrations) {
            this.event.registrations = [];
          }
          this.event.registrations.push(registration);
          this.registrations = this.event.registrations;
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Erreur lors de l\'inscription');
      }
    });
  }

  isMyEvent(): boolean {
    return this.event?.createdByUserId === this.currentUserId;
  }

  isFullEvent(): boolean {
    if (!this.event?.maxParticipants) return false;
    return (this.event.registrations?.length || 0) >= this.event.maxParticipants;
  }

  getProgressPercent(): number {
    if (!this.event?.maxParticipants) return 0;
    return Math.min(((this.event.registrations?.length || 0) / this.event.maxParticipants) * 100, 100);
  }

  getStatusClass(): string {
    const map: any = {
      'UPCOMING':  'badge-upcoming',
      'ONGOING':   'badge-ongoing',
      'COMPLETED': 'badge-completed',
      'CANCELLED': 'badge-cancelled'
    };
    return map[this.event?.status || ''] || '';
  }

  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  goBack(): void {
    this.router.navigate(['/main/events']);
  }

  goToEdit(): void {
    this.router.navigate(['/main/events/edit', this.eventId]);
  }
}