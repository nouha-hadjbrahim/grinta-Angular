import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UpdateUserComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();

  updateForm!: FormGroup;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  roles = ['ADMIN', 'USER'];
  statuses = ['ACTIVE', 'INACTIVE'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.user) {
      this.photoPreview = this.getPhotoUrl(this.user.photo);
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      role: ['USER', [Validators.required]],
      status: ['ACTIVE', [Validators.required]]
    });
  }

  private populateForm(): void {
    if (this.user) {
      const phone = this.user.phoneNumber || this.user.phone || '';
      this.updateForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phoneNumber: phone,
        role: this.user.role,
        status: this.user.status
      });
    }
  }

  onPhotoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name, file.size, file.type);

      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getPhotoUrl(photo: string | undefined): string {
    // SVG placeholder
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"%3E%3Crect fill="%23e0e0e0" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3ENo Photo%3C/text%3E%3C/svg%3E';
    
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

  onSubmit(): void {
    if (this.updateForm.invalid || !this.user || !this.user.id) {
      return;
    }

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formData = new FormData();
    
    // Add text fields only if they have values
    const name = this.updateForm.get('name')?.value;
    const email = this.updateForm.get('email')?.value;
    const phoneNumber = this.updateForm.get('phoneNumber')?.value;
    const role = this.updateForm.get('role')?.value;
    const status = this.updateForm.get('status')?.value;
    
    if (name) formData.append('name', name);
    if (email) formData.append('email', email);
    if (phoneNumber) formData.append('phoneNumber', phoneNumber);
    if (role) formData.append('role', role);
    if (status) formData.append('status', status);

    // Add file with field name "file" (backend also accepts "image")
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
      console.log('File appended:', this.selectedFile.name, '|', this.selectedFile.size, 'bytes');
    }

    // Debug FormData
    console.log('Sending FormData with fields:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`  ${key}: File (${value.name}, ${value.size} bytes, type: ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    this.userService.updateUser(this.user.id, formData).subscribe({
      next: (response: any) => {
        console.log('Update successful!', response);
        if (response.photo) {
          console.log('Photo saved in database:', response.photo);
        }
        this.loading = false;
        this.successMessage = 'User updated successfully!';
        setTimeout(() => {
          this.resetForm();
          this.closeModal();
          this.userUpdated.emit();
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.loading = false;
        if (err.status === 400) {
          this.errorMessage = 'Validation error: ' + err.error.message;
        } else if (err.status === 401) {
          this.errorMessage = 'Unauthorized. Please login again.';
        } else {
          this.errorMessage = 'Failed to update user. Please try again.';
        }
      }
    });
  }

  resetForm(): void {
    this.updateForm.reset();
    this.photoPreview = null;
    this.selectedFile = null;
    this.successMessage = null;
    this.errorMessage = null;
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.updateForm.valid;
  }
}
