import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Workout } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private mockWorkouts: Workout[] = [
    { id: '1', name: 'HIIT Training', category: 'Cardio', difficulty: 'Hard', duration: 30, rating: 4.8, createdBy: 'Coach Alex' },
    { id: '2', name: 'Strength Basics', category: 'Strength', difficulty: 'Easy', duration: 45, rating: 4.6, createdBy: 'Coach Mike' },
    { id: '3', name: 'Yoga Flow', category: 'Flexibility', difficulty: 'Medium', duration: 60, rating: 4.9, createdBy: 'Coach Sarah' },
    { id: '4', name: 'Pilates Core', category: 'Core', difficulty: 'Medium', duration: 40, rating: 4.7, createdBy: 'Coach Lisa' },
    { id: '5', name: 'Boxing Basics', category: 'Combat', difficulty: 'Hard', duration: 50, rating: 4.5, createdBy: 'Coach John' }
  ];

  getWorkouts(): Observable<Workout[]> {
    return of(this.mockWorkouts);
  }

  getWorkoutById(id: string): Observable<Workout | undefined> {
    return of(this.mockWorkouts.find(w => w.id === id));
  }

  updateWorkout(id: string, workout: Workout): Observable<Workout> {
    const index = this.mockWorkouts.findIndex(w => w.id === id);
    if (index > -1) {
      this.mockWorkouts[index] = workout;
    }
    return of(workout);
  }

  deleteWorkout(id: string): Observable<boolean> {
    const index = this.mockWorkouts.findIndex(w => w.id === id);
    if (index > -1) {
      this.mockWorkouts.splice(index, 1);
    }
    return of(true);
  }

  addWorkout(workout: Workout): Observable<Workout> {
    this.mockWorkouts.push(workout);
    return of(workout);
  }
}
