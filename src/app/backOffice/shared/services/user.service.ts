import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    { id: '1', name: 'John Smith', email: 'john.smith@example.com', role: 'Premium', joinedDate: '2024-01-15', status: 'Active', avatar: '👤' },
    { id: '2', name: 'Emma Johnson', email: 'emma.j@example.com', role: 'Basic', joinedDate: '2024-02-20', status: 'Active', avatar: '👤' },
    { id: '3', name: 'Michael Brown', email: 'm.brown@example.com', role: 'Premium', joinedDate: '2024-01-10', status: 'Active', avatar: '👤' },
    { id: '4', name: 'Sarah Davis', email: 'sarah.davis@example.com', role: 'Premium', joinedDate: '2024-03-05', status: 'Inactive', avatar: '👤' },
    { id: '5', name: 'David Wilson', email: 'd.wilson@example.com', role: 'Basic', joinedDate: '2024-02-28', status: 'Active', avatar: '👤' },
    { id: '6', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Premium', joinedDate: '2024-01-22', status: 'Active', avatar: '👤' },
    { id: '7', name: 'James Taylor', email: 'j.taylor@example.com', role: 'Basic', joinedDate: '2024-03-12', status: 'Active', avatar: '👤' },
    { id: '8', name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Premium', joinedDate: '2024-02-15', status: 'Inactive', avatar: '👤' }
  ];

  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.mockUsers.find(u => u.id === id));
  }

  updateUser(id: string, user: User): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
      this.mockUsers[index] = user;
    }
    return of(user);
  }

  deleteUser(id: string): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index > -1) {
      this.mockUsers.splice(index, 1);
    }
    return of(true);
  }

  addUser(user: User): Observable<User> {
    this.mockUsers.push(user);
    return of(user);
  }
}
