import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/Community/post.service';
import { AuthService } from '../../../services/User/auth.service';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css']
})
export class AddCommunityComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() postAdded = new EventEmitter<void>();

  addForm!: FormGroup;
  photoPreviews: string[] = [];
  selectedFiles: File[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  postTypes = ['PROGRESS', 'ACHIEVEMENT', 'GENERAL'];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      content: ['', [Validators.required]],
      type: ['GENERAL', [Validators.required]]
    });
  }

  onPhotoSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Each image size should be less than 5MB / some were ignored.';
          return;
        }
        this.selectedFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          this.photoPreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    // reset input value so re-selecting same files triggers change event
    event.target.value = null;
  }

  removeImage(index: number): void {
    this.photoPreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.addForm.invalid) return;

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      this.errorMessage = 'User not authenticated';
      this.loading = false;
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUserId.toString());
    formData.append('content', this.addForm.get('content')?.value);
    formData.append('type', this.addForm.get('type')?.value);
    
    // Add multiple files with field name "files"
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.successMessage = 'Post added successfully!';
        this.loading = false;
        setTimeout(() => {
          this.postAdded.emit();
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        console.error('Error adding post:', err);
        this.errorMessage = err.error?.message || 'Failed to add post';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    if (this.addForm) {
      this.addForm.reset({ type: 'GENERAL' });
    }
    this.photoPreviews = [];
    this.selectedFiles = [];
    this.successMessage = null;
    this.errorMessage = null;
  }

  closeModal(): void {
    this.resetForm();
    this.isOpen = false;
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.addForm?.valid ?? false;
  }
}
