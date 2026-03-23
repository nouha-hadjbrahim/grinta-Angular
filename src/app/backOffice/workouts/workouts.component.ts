import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../shared/services/workout.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Workout {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  rating: number;
  createdBy: string;
}

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
  workouts: Workout[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', label: 'Workout Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'difficulty', label: 'Difficulty', sortable: false },
    { key: 'duration', label: 'Duration (min)', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.workoutService.getWorkouts().subscribe((data: any[]) => {
      this.workouts = data;
    });
  }

  onAction(event: { action: string; item: Workout }): void {
    switch (event.action) {
      case 'view':
        this.viewWorkout(event.item);
        break;
      case 'edit':
        this.editWorkout(event.item);
        break;
      case 'delete':
        this.deleteWorkout(event.item);
        break;
    }
  }

  viewWorkout(workout: Workout): void {
    alert(`Viewing workout: ${workout.name}`);
  }

  editWorkout(workout: Workout): void {
    alert(`Editing workout: ${workout.name}`);
  }

  deleteWorkout(workout: Workout): void {
    if (confirm(`Are you sure you want to delete ${workout.name}?`)) {
      this.workoutService.deleteWorkout(workout.id).subscribe(() => {
        this.loadWorkouts();
        alert('Workout deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new workout dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
