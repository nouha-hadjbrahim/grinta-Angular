import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent, GrintaEventTag, GrintaEventRegistration } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-events-main',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: GrintaEvent[] = [];
  searchText = '';
  showMyEvents = false;
  loading = false;  // Ajouté pour l'indicateur de chargement

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
    this.loading = true;
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        // Charger les inscriptions pour chaque événement
        this.loadRegistrationsForEvents();
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  // Charger les inscriptions pour tous les événements
  loadRegistrationsForEvents(): void {
    if (this.events.length === 0) {
      this.loading = false;
      return;
    }

    const registrationRequests = this.events.map(event => 
      this.eventService.getRegistrations(event.id!)
    );

    forkJoin(registrationRequests).subscribe({
      next: (registrationsList) => {
        this.events.forEach((event, index) => {
          event.registrations = registrationsList[index];
        });
        this.loading = false;
        console.log('Events with registrations:', this.events);
      },
      error: (err) => {
        console.error('Error loading registrations:', err);
        this.loading = false;
      }
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

  registerToEvent(event: GrintaEvent): void {
  const userId = this.currentUserId;
  
  // Vérifications avant l'appel API
  if (!userId) { 
    alert('Vous devez être connecté !'); 
    return; 
  }
  
  // Vérifier si déjà inscrit
  if (this.isUserRegistered(event)) {
    alert('Vous êtes déjà inscrit à cet événement !');
    return;
  }
  
  // Vérifier si complet
  if (this.isFullEvent(event)) {
    alert('Cet événement est complet !');
    return;
  }
  
  this.eventService.register(event.id!, userId).subscribe({
    next: (registration) => {
      alert('Inscription réussie !');
      // Mettre à jour localement l'événement
      const targetEvent = this.events.find(e => e.id === event.id);
      if (targetEvent) {
        if (!targetEvent.registrations) {
          targetEvent.registrations = [];
        }
        targetEvent.registrations.push(registration);
        // Forcer le rafraîchissement du tableau
        this.events = [...this.events];
      }
    },
    error: (err) => {
      console.error('Registration error:', err);
      alert('Erreur lors de l\'inscription');
    }
  });
}

  isMyEvent(event: GrintaEvent): boolean {
    return event.createdByUserId === this.currentUserId;
  }

  isFullEvent(event: GrintaEvent): boolean {
    if (!event.maxParticipants) return false;
    return (event.registrations?.length || 0) >= event.maxParticipants;
  }

 isUserRegistered(event: GrintaEvent): boolean {
  const userId = this.currentUserId;
  if (!userId || !event.registrations) return false;
  
  // Vérifie la structure retournée par ton backend
  return event.registrations.some(reg => {
    // Si la registration a reg.userId (si tu as ajouté getUserId() dans backend)
    if (reg.userId) {
      return reg.userId === userId;
    }
    // Si la registration a reg.user.id (structure par défaut)
    if (reg.user && reg.user.id) {
      return reg.user.id === userId;
    }
    return false;
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

  getTagStyle(tag: GrintaEventTag): any {
    const bgColor = tag.color || '#e63946';
    const isDark = this.isDarkColor(bgColor);
    return {
      'background-color': bgColor,
      'color': isDark ? '#ffffff' : '#000000'
    };
  }

  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }
}