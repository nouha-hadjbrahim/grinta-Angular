import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateUserComponent } from './update-user/update-user.component';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  photo?: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  photo: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UpdateUserComponent]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Modal
  showModal: boolean = false;
  selectedUserDetails: UserDetail | null = null;
  
  // Update Modal
  showUpdateModal: boolean = false;
  userToUpdate: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.currentPage = 1;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        if (err.status === 403) {
          this.error = 'Access denied. Your session may have expired. Please log in again.';
        } else if (err.status === 401) {
          this.error = 'Authentication required. Please log in.';
        } else if (err.status === 0) {
          this.error = 'Unable to connect to server. Please check your connection.';
        } else {
          this.error = 'Failed to load users. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  // Get paginated users
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Search functionality
  searchUsers(term: string): void {
    this.searchTerm = term.toLowerCase();
    if (this.searchTerm === '') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm)
      );
    }
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // Pagination navigation
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Get page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Get pagination end index for display
  getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  // Get photo with fallback
  getPhotoUrl(photo: string | null | undefined): string {
    // SVG placeholder
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect fill="%23e0e0e0" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%23999"%3E?%3C/text%3E%3C/svg%3E';
    
    if (!photo || photo.trim() === '') {
      return placeholder;
    }
    
    // Skip invalid paths that come from backend
    if (photo.includes('assets/') || photo.includes('default.png') || photo === 'null') {
      return placeholder;
    }
    
    if (photo.startsWith('http') || photo.startsWith('data:')) {
      return photo;
    }
    
    // Handle path construction for uploads
    const path = photo.includes('uploads/') ? `http://localhost:8000/${photo}` : `http://localhost:8000/uploads/${photo}`;
    return path;
  }

  // Get status badge color
  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'badge-active' : 'badge-inactive';
  }

  // View user details
  viewUserDetails(user: User): void {
    this.loading = true;
    this.userService.getUserById(user.id).subscribe({
      next: (data: any) => {
        this.selectedUserDetails = data;
        this.showModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user details:', err);
        this.error = 'Failed to load user details. Please try again.';
        this.loading = false;
      }
    });
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.selectedUserDetails = null;
  }

  // Open update modal
  openUpdateModal(user: User): void {
    this.userToUpdate = user;
    this.showUpdateModal = true;
  }

  // Close update modal
  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.userToUpdate = null;
  }

  // Refresh users after update
  onUserUpdated(): void {
    this.closeUpdateModal();
    this.loadUsers();
  }

  // Delete user
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.loading = true;
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          alert('User deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error = 'Failed to delete user. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
