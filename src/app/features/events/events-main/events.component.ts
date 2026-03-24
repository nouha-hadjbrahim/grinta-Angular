import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent, GrintaEventTag } from '../../../services/events/grinta-event.model';
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
    this.eventService.getAll().subscribe(data => {
      this.events = data;
      console.log('Events loaded:', this.events); // Pour déboguer
    });
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

  // Méthode pour obtenir le style du tag (couleur de fond et texte)
  getTagStyle(tag: GrintaEventTag): any {
    const bgColor = tag.color || '#e63946';
    const isDark = this.isDarkColor(bgColor);
    return {
      'background-color': bgColor,
      'color': isDark ? '#ffffff' : '#000000'
    };
  }

  // Vérifie si une couleur est sombre pour adapter la couleur du texte
  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Formule de luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  // Formate la date pour l'affichage
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }
}