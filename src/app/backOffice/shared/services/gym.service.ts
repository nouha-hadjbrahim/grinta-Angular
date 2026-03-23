import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Gym } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private mockGyms: Gym[] = [
    { id: '1', name: 'FitHub Downtown', city: 'New York', address: '123 Main St', members: 1250, rating: 4.7, phone: '(555) 123-4567' },
    { id: '2', name: 'PowerZone Gym', city: 'Los Angeles', address: '456 Oak Ave', members: 980, rating: 4.5, phone: '(555) 234-5678' },
    { id: '3', name: 'Elite Fitness', city: 'Chicago', address: '789 Pine Rd', members: 1450, rating: 4.8, phone: '(555) 345-6789' },
    { id: '4', name: 'Strength Peak', city: 'Houston', address: '321 Elm St', members: 850, rating: 4.3, phone: '(555) 456-7890' },
    { id: '5', name: 'Flex Center', city: 'Miami', address: '654 Beach Dr', members: 1100, rating: 4.6, phone: '(555) 567-8901' }
  ];

  getGyms(): Observable<Gym[]> {
    return of(this.mockGyms);
  }

  getGymById(id: string): Observable<Gym | undefined> {
    return of(this.mockGyms.find(g => g.id === id));
  }

  updateGym(id: string, gym: Gym): Observable<Gym> {
    const index = this.mockGyms.findIndex(g => g.id === id);
    if (index > -1) {
      this.mockGyms[index] = gym;
    }
    return of(gym);
  }

  deleteGym(id: string): Observable<boolean> {
    const index = this.mockGyms.findIndex(g => g.id === id);
    if (index > -1) {
      this.mockGyms.splice(index, 1);
    }
    return of(true);
  }

  addGym(gym: Gym): Observable<Gym> {
    this.mockGyms.push(gym);
    return of(gym);
  }
}
