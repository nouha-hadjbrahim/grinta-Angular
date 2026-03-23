import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Community } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private mockCommunities: Community[] = [
    { id: '1', name: 'Marathon Runners', description: 'Community for long-distance runners', members: 542, createdDate: '2023-06-15', status: 'Active' },
    { id: '2', name: 'Yoga Enthusiasts', description: 'Daily yoga practice and meditation', members: 876, createdDate: '2023-08-20', status: 'Active' },
    { id: '3', name: 'CrossFit Warriors', description: 'High-intensity fitness challenges', members: 345, createdDate: '2023-10-10', status: 'Active' },
    { id: '4', name: 'Weight Loss Journey', description: 'Support group for fitness goals', members: 1234, createdDate: '2023-05-05', status: 'Active' },
    { id: '5', name: 'Nutrition Tips', description: 'Healthy eating and diet discussions', members: 678, createdDate: '2023-09-12', status: 'Inactive' }
  ];

  getCommunities(): Observable<Community[]> {
    return of(this.mockCommunities);
  }

  getCommunityById(id: string): Observable<Community | undefined> {
    return of(this.mockCommunities.find(c => c.id === id));
  }

  updateCommunity(id: string, community: Community): Observable<Community> {
    const index = this.mockCommunities.findIndex(c => c.id === id);
    if (index > -1) {
      this.mockCommunities[index] = community;
    }
    return of(community);
  }

  deleteCommunity(id: string): Observable<boolean> {
    const index = this.mockCommunities.findIndex(c => c.id === id);
    if (index > -1) {
      this.mockCommunities.splice(index, 1);
    }
    return of(true);
  }

  addCommunity(community: Community): Observable<Community> {
    this.mockCommunities.push(community);
    return of(community);
  }
}
