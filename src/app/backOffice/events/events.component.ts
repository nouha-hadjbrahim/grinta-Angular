import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/services/event.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'registered', label: 'Registered', sortable: false },
    { key: 'status', label: 'Status', sortable: false }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((data: any[]) => {
      this.events = data;
    });
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
    console.log('View event:', event);
    alert(`Viewing event: ${event.name}`);
  }

  editEvent(event: Event): void {
    console.log('Edit event:', event);
    alert(`Editing event: ${event.name}`);
  }

  deleteEvent(event: Event): void {
    if (confirm(`Are you sure you want to delete ${event.name}?`)) {
      this.eventService.deleteEvent(event.id).subscribe(() => {
        this.loadEvents();
        alert('Event deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new event dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
