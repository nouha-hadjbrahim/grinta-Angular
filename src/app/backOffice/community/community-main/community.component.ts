import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/Community/post.service';
import { Post, PostComment } from '../../../services/Community/post.model';
import { AddCommunityComponent } from '../add-community/add-community.component';
import { UpdateCommunityComponent } from '../update-community/update-community.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AddCommunityComponent, UpdateCommunityComponent]
})
export class CommunityComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Modals
  showAddModal: boolean = false;
  showUpdateModal: boolean = false;
  postToUpdate: Post | null = null;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    this.postService.getAllPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.filteredPosts = data;
        this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage) || 1;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching posts:', err);
        this.error = 'Failed to load community posts';
        this.loading = false;
      }
    });
  }

  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPosts.slice(startIndex, endIndex);
  }

  searchPosts(term: string): void {
    this.searchTerm = term.toLowerCase();
    if (this.searchTerm === '') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => 
        post.content?.toLowerCase().includes(this.searchTerm) || 
        post.userEmail?.toLowerCase().includes(this.searchTerm) ||
        post.type?.toLowerCase().includes(this.searchTerm)
      );
    }
    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage) || 1;
    this.currentPage = 1;
  }

  // Pagination...
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredPosts.length);
  }

  // Add / Update logic
  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openUpdateModal(post: Post): void {
    this.postToUpdate = post;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.postToUpdate = null;
    this.showUpdateModal = false;
  }

  onPostAddedOrUpdated(): void {
    this.loadPosts();
  }

  deletePost(post: Post): void {
    if (confirm(`Are you sure you want to delete this post by ${post.userEmail}?`)) {
      this.postService.deletePost(post.postId).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (err: any) => {
          console.error('Error deleting post', err);
          alert('Failed to delete the post');
        }
      });
    }
  }

  // View Modal logic
  postToView: Post | null = null;
  viewMode: 'details' | 'likes' | 'comments' = 'details';

  openViewModal(post: Post, mode: 'details' | 'likes' | 'comments' = 'details'): void {
    this.postToView = post;
    this.viewMode = mode;
    
    if (mode === 'comments' && (!post.comments || post.comments.length === 0)) {
        this.postService.getComments(post.postId).subscribe({
            next: (comments) => {
               this.postToView!.comments = this.organizeComments(comments);
            },
            error: (err) => console.error('Error loading comments', err)
        });
    }
  }

  closeViewModal(): void {
    this.postToView = null;
  }

  organizeComments(flatComments: PostComment[]): PostComment[] {
    const commentMap = new Map<number, PostComment>();
    const roots: PostComment[] = [];

    flatComments.forEach(c => {
      c.replies = [];
      commentMap.set(c.commentId, c);
    });

    flatComments.forEach(c => {
      if (c.parentCommentId) {
        const parent = commentMap.get(c.parentCommentId);
        if (parent && parent.replies) {
          parent.replies.push(c);
        }
      } else {
        roots.push(c);
      }
    });

    return roots;
  }

  getAbsoluteImageUrl(imgName?: string): string {
    if (!imgName) return '';
    return imgName.includes('http') || imgName.startsWith('data:') ? imgName : `http://localhost:8000/uploads/${imgName}`;
  }

  deleteComment(comment: PostComment, post: Post): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.postService.deleteComment(comment.commentId).subscribe({
        next: () => {
          // Remove from view
          if (post.comments) {
            // Re-fetch comments to reconstruct the tree properly or manually remove
            this.postService.getComments(post.postId).subscribe({
               next: (comments) => {
                  post.comments = this.organizeComments(comments);
                  post.commentsCount = Math.max(0, post.commentsCount - 1);
               }
            });
          }
        },
        error: (err) => {
          console.error('Error deleting comment', err);
          alert('Failed to delete comment');
        }
      });
    }
  }
}

