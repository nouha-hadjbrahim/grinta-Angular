import { Component } from '@angular/core';
import { MenuItem } from '../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'bi bi-speedometer2', route: '/admin' },
    { label: 'Users', icon: 'bi bi-people', route: '/admin/users' },
    { label: 'Events', icon: 'bi bi-calendar-event', route: '/admin/events' },
    { label: 'Workouts', icon: 'bi bi-heart-pulse', route: '/admin/workouts' },
    { label: 'Gym', icon: 'bi bi-building', route: '/admin/gyms' },
    { label: 'Training', icon: 'bi bi-mortarboard', route: '/admin/training' },
    { label: 'Nutrition', icon: 'bi bi-apple', route: '/admin/nutrition' },
    { label: 'Bookings', route: '/admin/bookings', icon: 'bi bi-calendar-check' },
    { label: 'Community', icon: 'bi bi-chat-dots', route: '/admin/community' },
  ];

  activeRoute: string = '/admin';

  constructor(private router: Router) {
    this.activeRoute = this.router.url;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.activeRoute = route;
  }
}
