import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../shared/services/training.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Training {
  id: string;
  title: string;
  coach: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  price: number;
  enrolled: number;
}

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  trainings: Training[] = [];
  
  columns: TableColumn[] = [
    { key: 'title', label: 'Training Title', sortable: true },
    { key: 'coach', label: 'Coach', sortable: true },
    { key: 'level', label: 'Level', sortable: false },
    { key: 'enrolled', label: 'Enrolled', sortable: true },
    { key: 'price', label: 'Price', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings().subscribe((data: any[]) => {
      this.trainings = data;
    });
  }

  onAction(event: { action: string; item: Training }): void {
    switch (event.action) {
      case 'view':
        this.viewTraining(event.item);
        break;
      case 'edit':
        this.editTraining(event.item);
        break;
      case 'delete':
        this.deleteTraining(event.item);
        break;
    }
  }

  viewTraining(training: Training): void {
    alert(`Viewing training: ${training.title}`);
  }

  editTraining(training: Training): void {
    alert(`Editing training: ${training.title}`);
  }

  deleteTraining(training: Training): void {
    if (confirm(`Are you sure you want to delete ${training.title}?`)) {
      this.trainingService.deleteTraining(training.id).subscribe(() => {
        this.loadTrainings();
        alert('Training deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new training dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
