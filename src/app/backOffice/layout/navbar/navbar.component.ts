import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

interface User {
  id?: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  photo?: string;
  role: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  adminName = 'Admin';
  adminEmail = '';
  adminAvatar = '👤';
  userPhoto: string = '';
  showDropdown = false;
  
  // Profile Modal
  showProfileModal = false;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  /**
   * Load user info from AuthService
   */
  loadUserInfo(): void {
    const authUser = this.authService.getUser();
    if (authUser) {
      this.adminEmail = authUser.email;
      // Extract first letter of email for avatar fallback
      this.adminAvatar = authUser.email.charAt(0).toUpperCase();
      
      // Fetch full user details to get photo and name
      if (authUser.id) {
        this.userService.getUserById(authUser.id).subscribe({
          next: (user: User) => {
            if (user.photo) {
              this.userPhoto = this.getPhotoUrl(user.photo);
            }
            if (user.name) {
              this.adminName = user.name;
            }
          },
          error: (err) => {
            console.error('Error loading user photo:', err);
          }
        });
      }
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  navigateToProfile(): void {
    // Get the current user from AuthService
    const authUser = this.authService.getUser();
    if (authUser && authUser.id) {
      // Fetch full user details and open modal
      this.userService.getUserById(authUser.id).subscribe({
        next: (user: User) => {
          this.currentUser = user;
          this.showProfileModal = true;
          this.showDropdown = false;
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        }
      });
    }
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.currentUser = null;
  }

  onProfileUpdated(): void {
    this.closeProfileModal();
    // Reload user info after update
    this.loadUserInfo();
  }

  /**
   * Get photo URL with fallback
   */
  getPhotoUrl(photo: string | undefined): string {
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect fill=%22%23e0e0e0%22 width=%2240%22 height=%2240%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2210%22 fill=%22%23999%22%3E?%3C/text%3E%3C/svg%3E';
    
    if (!photo || photo.trim() === '') {
      return placeholder;
    }
    
    if (photo.includes('assets/') || photo.includes('default.png') || photo === 'null') {
      return placeholder;
    }
    
    if (photo.startsWith('http') || photo.startsWith('data:')) {
      return photo;
    }
    
    const path = photo.includes('uploads/') ? `http://localhost:8000/${photo}` : `http://localhost:8000/uploads/${photo}`;
    return path;
  }

  /**
   * Logout user and clear authentication
   */
  logout(): void {
    this.authService.logout();
    this.showDropdown = false;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }
}
