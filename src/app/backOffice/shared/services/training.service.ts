import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Training } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private mockTrainings: Training[] = [
    { id: '1', title: 'Beginner Strength Training', coach: 'Coach Mike', level: 'Beginner', duration: 8, price: 99, enrolled: 234 },
    { id: '2', title: 'Advanced CrossFit', coach: 'Coach Alex', level: 'Advanced', duration: 12, price: 199, enrolled: 156 },
    { id: '3', title: 'Intermediate Yoga', coach: 'Coach Sarah', level: 'Intermediate', duration: 6, price: 79, enrolled: 342 },
    { id: '4', title: 'Nutrition & Fitness', coach: 'Coach John', level: 'Beginner', duration: 4, price: 49, enrolled: 128 },
    { id: '5', title: 'Personal Training Cert', coach: 'Coach Lisa', level: 'Advanced', duration: 16, price: 299, enrolled: 89 }
  ];

  getTrainings(): Observable<Training[]> {
    return of(this.mockTrainings);
  }

  getTrainingById(id: string): Observable<Training | undefined> {
    return of(this.mockTrainings.find(t => t.id === id));
  }

  updateTraining(id: string, training: Training): Observable<Training> {
    const index = this.mockTrainings.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTrainings[index] = training;
    }
    return of(training);
  }

  deleteTraining(id: string): Observable<boolean> {
    const index = this.mockTrainings.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTrainings.splice(index, 1);
    }
    return of(true);
  }

  addTraining(training: Training): Observable<Training> {
    this.mockTrainings.push(training);
    return of(training);
  }
}
