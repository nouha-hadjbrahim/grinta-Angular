import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';

@Component({
  selector: 'app-events-main',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: GrintaEvent[] = [];
  searchText = '';
  showMyEvents = false;

  get currentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe(data => this.events = data);
  }

  get filteredEvents(): GrintaEvent[] {
    let list = this.events;
    if (this.showMyEvents) {
      list = list.filter(e => e.createdByUserId === this.currentUserId);
    }
    if (this.searchText.trim()) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.location.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    return list;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/main/events', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/main/events/create']);
  }

  openEdit(event: GrintaEvent): void {
    this.router.navigate(['/main/events/edit', event.id]);
  }

  deleteEvent(id: number): void {
    if (confirm('Supprimer cet événement ?')) {
      this.eventService.delete(id).subscribe(() => this.loadEvents());
    }
  }

  registerToEvent(eventId: number): void {
    const userId = this.currentUserId;
    if (!userId) { alert('Vous devez être connecté !'); return; }
    this.eventService.register(eventId, userId).subscribe({
      next: () => { alert('Inscription réussie !'); this.loadEvents(); },
      error: () => alert('Déjà inscrit ou événement complet')
    });
  }

  isMyEvent(event: GrintaEvent): boolean {
    return event.createdByUserId === this.currentUserId;
  }

  isFullEvent(event: GrintaEvent): boolean {
    if (!event.maxParticipants) return false;
    return (event.registrations?.length || 0) >= event.maxParticipants;
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
}