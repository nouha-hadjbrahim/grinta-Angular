import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Nutrition } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private mockNutritions: Nutrition[] = [
    { id: '1', name: 'High Protein Plan', nutritionist: 'Dr. Sarah', type: 'Plan', calories: 2500, createdDate: '2024-01-15' },
    { id: '2', name: 'Weight Loss Recipe', nutritionist: 'Dr. Mike', type: 'Recipe', calories: 1800, createdDate: '2024-02-10' },
    { id: '3', name: 'Muscle Building Meal', nutritionist: 'Dr. Lisa', type: 'Meal', calories: 3000, createdDate: '2024-01-28' },
    { id: '4', name: 'Vegan Nutrition Plan', nutritionist: 'Dr. Emma', type: 'Plan', calories: 2000, createdDate: '2024-03-05' },
    { id: '5', name: 'Athlete Performance Meal', nutritionist: 'Dr. John', type: 'Meal', calories: 2800, createdDate: '2024-02-20' }
  ];

  getNutritions(): Observable<Nutrition[]> {
    return of(this.mockNutritions);
  }

  getNutritionById(id: string): Observable<Nutrition | undefined> {
    return of(this.mockNutritions.find(n => n.id === id));
  }

  updateNutrition(id: string, nutrition: Nutrition): Observable<Nutrition> {
    const index = this.mockNutritions.findIndex(n => n.id === id);
    if (index > -1) {
      this.mockNutritions[index] = nutrition;
    }
    return of(nutrition);
  }

  deleteNutrition(id: string): Observable<boolean> {
    const index = this.mockNutritions.findIndex(n => n.id === id);
    if (index > -1) {
      this.mockNutritions.splice(index, 1);
    }
    return of(true);
  }

  addNutrition(nutrition: Nutrition): Observable<Nutrition> {
    this.mockNutritions.push(nutrition);
    return of(nutrition);
  }
}
