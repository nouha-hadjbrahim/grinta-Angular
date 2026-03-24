import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminEventService } from '../../services/events/admin-event.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Event {
  id: string;
  name: string;
  title?: string;
  date: string;
  time?: string;
  location: string;
  capacity: number;
  maxParticipants?: number;
  registered: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdByUserId?: number;
  registrations?: any[];
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchText = '';
  selectedStatus = '';
  selectedCreator = '';
  loading = false;

  stats = {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0
  };

  creators: { id: number; name: string }[] = [];

  columns: TableColumn[] = [
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'location', label: 'Lieu', sortable: true },
    { key: 'registered', label: 'Inscrits', sortable: false },
    { key: 'status', label: 'Statut', sortable: false },
    { key: 'createdByUserId', label: 'Créateur', sortable: false }
  ];

  actions: TableAction[] = [
    { label: 'Voir', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Modifier', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Supprimer', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(
    private adminEventService: AdminEventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.adminEventService.getAllEvents().subscribe({
      next: (data: any[]) => {
        this.events = data.map(event => ({
          ...event,
          title: event.title,
          registered: event.registrations?.length || 0,
          capacity: event.maxParticipants
        }));
        this.calculateStats();
        this.extractCreators();
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.events.length;
    this.stats.upcoming = this.events.filter(e => e.status === 'UPCOMING').length;
    this.stats.ongoing = this.events.filter(e => e.status === 'ONGOING').length;
    this.stats.completed = this.events.filter(e => e.status === 'COMPLETED').length;
    this.stats.cancelled = this.events.filter(e => e.status === 'CANCELLED').length;
  }

  extractCreators(): void {
    const creatorMap = new Map<number, string>();
    this.events.forEach(event => {
      if (event.createdByUserId && !creatorMap.has(event.createdByUserId)) {
        creatorMap.set(event.createdByUserId, `Utilisateur ${event.createdByUserId}`);
      }
    });
    this.creators = Array.from(creatorMap.entries()).map(([id, name]) => ({ id, name }));
  }

  applyFilters(): void {
    let list = [...this.events];

    if (this.selectedStatus) {
      list = list.filter(e => e.status === this.selectedStatus);
    }

    if (this.selectedCreator) {
      list = list.filter(e => e.createdByUserId === Number(this.selectedCreator));
    }

    if (this.searchText.trim()) {
      list = list.filter(e =>
        e.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.location?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredEvents = list;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(searchTerm: string): void {
    this.searchText = searchTerm;
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onCreatorFilterChange(creatorId: string): void {
    this.selectedCreator = creatorId;
    this.applyFilters();
  }

  onAction(event: { action: string; item: Event }): void {
    switch (event.action) {
      case 'view':
        this.viewEvent(event.item);
        break;
      case 'edit':
        this.editEvent(event.item);
        break;
      case 'delete':
        this.deleteEvent(event.item);
        break;
    }
  }

  viewEvent(event: Event): void {
    this.router.navigate(['/main/events', event.id]);
  }

  editEvent(event: Event): void {
    this.router.navigate(['/main/events/edit', event.id]);
  }

  deleteEvent(event: Event): void {
    if (confirm(`Supprimer "${event.title}" définitivement ?`)) {
      this.adminEventService.deleteEvent(Number(event.id)).subscribe({
        next: () => {
          alert('Événement supprimé !');
          this.loadEvents();
        },
        error: (error: any) => console.error('Error deleting event:', error)
      });
    }
  }

  changeStatus(event: Event, newStatus: string): void {
    if (!newStatus) return;
    if (confirm(`Changer le statut de "${event.title}" en ${newStatus} ?`)) {
      this.adminEventService.changeStatus(Number(event.id), newStatus).subscribe({
        next: () => {
          alert('Statut modifié !');
          this.loadEvents();
        },
        error: (error: any) => console.error('Error changing status:', error)
      });
    }
  }

  onAddNew(): void {
    this.router.navigate(['/main/events/create']);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'UPCOMING':  'badge-upcoming',
      'ONGOING':   'badge-ongoing',
      'COMPLETED': 'badge-completed',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || '';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  }

  getStatusOptions(): string[] {
    return ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
  }
}