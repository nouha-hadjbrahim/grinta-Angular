import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private mockEvents: Event[] = [
    { id: '1', name: 'Marathon 2024', date: '2024-04-15', location: 'Central Park', capacity: 500, registered: 432, status: 'Upcoming' },
    { id: '2', name: 'Yoga Retreat', date: '2024-03-28', location: 'Mountain Resort', capacity: 100, registered: 87, status: 'Upcoming' },
    { id: '3', name: 'CrossFit Championship', date: '2024-02-10', location: 'Sports Complex', capacity: 300, registered: 298, status: 'Completed' },
    { id: '4', name: 'Swimming Competition', date: '2024-03-20', location: 'Olympic Pool', capacity: 200, registered: 156, status: 'Ongoing' },
    { id: '5', name: 'Cycling Tour', date: '2024-04-30', location: 'Countryside', capacity: 250, registered: 189, status: 'Upcoming' }
  ];

  getEvents(): Observable<Event[]> {
    return of(this.mockEvents);
  }

  getEventById(id: string): Observable<Event | undefined> {
    return of(this.mockEvents.find(e => e.id === id));
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index > -1) {
      this.mockEvents[index] = event;
    }
    return of(event);
  }

  deleteEvent(id: string): Observable<boolean> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index > -1) {
      this.mockEvents.splice(index, 1);
    }
    return of(true);
  }

  addEvent(event: Event): Observable<Event> {
    this.mockEvents.push(event);
    return of(event);
  }
}
