import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/Community/post.service';
import { Post, PostImage } from '../../../services/Community/post.model';

@Component({
  selector: 'app-update-community',
  templateUrl: './update-community.component.html',
  styleUrls: ['./update-community.component.css'],
  
})
export class UpdateCommunityComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() post: Post | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() postUpdated = new EventEmitter<void>();

  updateForm!: FormGroup;
  
  // Existing Images
  existingImages: PostImage[] = [];
  deletedImageIds: number[] = [];

  // New Images
  newPhotoPreviews: string[] = [];
  newSelectedFiles: File[] = [];

  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  postTypes = ['PROGRESS', 'ACHIEVEMENT', 'GENERAL'];

  constructor(
    private fb: FormBuilder,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      content: ['', [Validators.required]],
      type: ['GENERAL', [Validators.required]]
    });
  }

  ngOnChanges(): void {
    if (this.post && this.updateForm) {
      this.resetLocalState();

      this.updateForm.patchValue({
        content: this.post.content,
        type: this.post.type
      });

      if (this.post.images && this.post.images.length > 0) {
        this.existingImages = [...this.post.images];
        // Sort by order just in case
        this.existingImages.sort((a, b) => a.order - b.order);
      }
    }
  }

  getAbsoluteImageUrl(imgName?: string): string {
    if (!imgName) return '';
    return imgName.includes('http') || imgName.startsWith('data:') ? imgName : `http://localhost:8000/uploads/${imgName}`;
  }

  onPhotoSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.size > 5 * 1024 * 1024) {
          this.errorMessage = 'Some images were skipped (exceeded 5MB).';
          return;
        }
        this.newSelectedFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          this.newPhotoPreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = null; // reset
  }

  removeExistingImage(index: number): void {
    const removedImg = this.existingImages[index];
    if (removedImg && removedImg.imageId) {
      this.deletedImageIds.push(removedImg.imageId);
    }
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newPhotoPreviews.splice(index, 1);
    this.newSelectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.post) return;

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('userId', this.post.userId.toString());
    formData.append('content', this.updateForm.get('content')?.value);
    formData.append('type', this.updateForm.get('type')?.value);

    // New Files
    this.newSelectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    // Deleted Image IDs
    this.deletedImageIds.forEach((id) => {
      formData.append('deletedImageIds', id.toString());
    });

    this.postService.updatePost(this.post.postId, formData).subscribe({
      next: () => {
        this.successMessage = 'Post updated successfully!';
        this.loading = false;
        setTimeout(() => {
          this.postUpdated.emit();
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        console.error('Error updating post:', err);
        this.errorMessage = err.error?.message || 'Failed to update post';
        this.loading = false;
      }
    });
  }

  resetLocalState(): void {
    this.existingImages = [];
    this.deletedImageIds = [];
    this.newPhotoPreviews = [];
    this.newSelectedFiles = [];
    this.successMessage = null;
    this.errorMessage = null;
  }

  resetForm(): void {
    this.resetLocalState();
    if (this.updateForm && this.post) {
      this.updateForm.patchValue({
        content: this.post.content,
        type: this.post.type
      });
    }
  }

  closeModal(): void {
    this.resetForm();
    this.isOpen = false;
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.updateForm?.valid ?? false;
  }
}
