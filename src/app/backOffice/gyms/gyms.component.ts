import { Component, OnInit } from '@angular/core';
import { GymService } from '../shared/services/gym.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  members: number;
  rating: number;
  phone: string;
}

@Component({
  selector: 'app-gyms',
  templateUrl: './gyms.component.html',
  styleUrls: ['./gyms.component.css']
})
export class GymsComponent implements OnInit {
  gyms: Gym[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', label: 'Gym Name', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'members', label: 'Members', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private gymService: GymService) {}

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getGyms().subscribe((data: any[]) => {
      this.gyms = data;
    });
  }

  onAction(event: { action: string; item: Gym }): void {
    switch (event.action) {
      case 'view':
        this.viewGym(event.item);
        break;
      case 'edit':
        this.editGym(event.item);
        break;
      case 'delete':
        this.deleteGym(event.item);
        break;
    }
  }

  viewGym(gym: Gym): void {
    alert(`Viewing gym: ${gym.name}`);
  }

  editGym(gym: Gym): void {
    alert(`Editing gym: ${gym.name}`);
  }

  deleteGym(gym: Gym): void {
    if (confirm(`Are you sure you want to delete ${gym.name}?`)) {
      this.gymService.deleteGym(gym.id).subscribe(() => {
        this.loadGyms();
        alert('Gym deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new gym dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
