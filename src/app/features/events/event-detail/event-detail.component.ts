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
  isAlreadyRegistered = false;
  eventId!: number;

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
    this.loadRegistrations();
  }

  loadEvent(): void {
    this.eventService.getById(this.eventId).subscribe({
      next: (data) => this.event = data,
      error: () => alert('Event introuvable')
    });
  }

  loadRegistrations(): void {
    this.eventService.getRegistrations(this.eventId).subscribe({
      next: (data) => {
        this.registrations = data;
        this.isAlreadyRegistered = data.some(
          r => r.userId === this.currentUserId
        );
      }
    });
  }

  register(): void {
    const userId = this.currentUserId;
    if (!userId) { alert('Vous devez être connecté !'); return; }
    this.eventService.register(this.eventId, userId).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.loadRegistrations();
        this.loadEvent();
      },
      error: () => alert('Déjà inscrit ou événement complet')
    });
  }

  isMyEvent(): boolean {
    return this.event?.createdByUserId === this.currentUserId;
  }

  isFullEvent(): boolean {
    if (!this.event?.maxParticipants) return false;
    return this.registrations.length >= this.event.maxParticipants;
  }

  getProgressPercent(): number {
    if (!this.event?.maxParticipants) return 0;
    return Math.min((this.registrations.length / this.event.maxParticipants) * 100, 100);
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

  goBack(): void {
    this.router.navigate(['/main/events']);
  }

  goToEdit(): void {
    this.router.navigate(['/main/events/edit', this.eventId]);
  }
}