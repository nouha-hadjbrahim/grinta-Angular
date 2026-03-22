import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../services/Community/post.service';
import { Post, PostComment, CreateCommentRequest } from '../../../services/Community/post.model';
import { AuthService } from '../../../services/User/auth.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit {

  posts: Post[] = [];
  currentUserId: number | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        // Filter out posts that belong to the logged-in user
        if (this.currentUserId !== null) {
          this.posts = data.filter(post => post.userId !== this.currentUserId);
        } else {
          this.posts = data;
        }
        
        // Initialize frontend-only properties
        this.posts.forEach(post => {
          post.showComments = false;
          post.comments = [];
          post.newCommentText = '';
          
          if (this.currentUserId !== null && post.likedByUserIds) {
            post.isLikedByMe = post.likedByUserIds.includes(this.currentUserId);
          } else {
            post.isLikedByMe = false;
          }
        });
        
        console.log('Posts fetched (filtered):', this.posts);
      },
      error: (err) => {
        console.error('Error fetching posts', err);
      }
    });
  }

  getAvatarInitials(email: string): string {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  toggleLike(post: Post): void {
    if (this.currentUserId === null) return;
    
    // Store in a local variable so TypeScript knows it's strictly a number inside the callback
    const userId = this.currentUserId;

    this.postService.toggleLike(post.postId, userId).subscribe({
      next: () => {
        if (!post.likedByUserIds) post.likedByUserIds = [];
        
        if (post.isLikedByMe) {
          post.likesCount--;
          post.isLikedByMe = false;
          post.likedByUserIds = post.likedByUserIds.filter(id => id !== userId);
        } else {
          post.likesCount++;
          post.isLikedByMe = true;
          post.likedByUserIds.push(userId);
        }
      },
      error: (err) => console.error('Error toggling like', err)
    });
  }

  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
    if (post.showComments && (!post.comments || post.comments.length === 0)) {
      this.postService.getComments(post.postId).subscribe({
        next: (comments) => {
          post.comments = this.organizeComments(comments);
        },
        error: (err) => console.error('Error fetching comments', err)
      });
    }
  }

  organizeComments(comments: PostComment[]): PostComment[] {
    const userId = this.currentUserId;
    if (userId === null) return [];

    const commentMap = new Map<number, PostComment>();
    const rootComments: PostComment[] = [];

    // Initialize all comments and put them in a map
    comments.forEach(c => {
      c.replies = [];
      c.showReplyInput = false;
      c.newReplyText = '';
      c.isLikedByMe = c.likedByUserIds ? c.likedByUserIds.includes(userId) : false;
      commentMap.set(c.commentId, c);
    });

    // Build the tree structure
    comments.forEach(c => {
      if (c.parentCommentId) {
        const parent = commentMap.get(c.parentCommentId);
        if (parent) {
          parent.replies?.push(c);
        } else {
           rootComments.push(c); // Fallback: if parent not found, show as root
        }
      } else {
        rootComments.push(c);
      }
    });

    return rootComments;
  }

  toggleCommentLike(comment: PostComment): void {
    const userId = this.currentUserId;
    if (userId === null) {
      console.warn("User must be logged in to like a comment.");
      return;
    }

    const previousState = comment.isLikedByMe;
    
    // Optimistic UI update
    comment.isLikedByMe = !comment.isLikedByMe;
    comment.likesCount = (comment.likesCount || 0) + (comment.isLikedByMe ? 1 : -1);

    this.postService.toggleCommentLike(comment.commentId, userId).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Error toggling comment like:', err);
        // Revert optimistic update on error
        comment.isLikedByMe = previousState;
        comment.likesCount = (comment.likesCount || 0) + (comment.isLikedByMe ? 1 : -1);
      }
    });
  }

  toggleReplyInput(comment: PostComment): void {
    comment.showReplyInput = !comment.showReplyInput;
  }

  submitReply(post: Post, parentComment: PostComment): void {
    const userId = this.currentUserId;
    if (userId === null) {
      console.warn("User must be logged in to reply.");
      return;
    }

    if (!parentComment.newReplyText || parentComment.newReplyText.trim() === '') {
      return;
    }

    const request: CreateCommentRequest = {
      userId: userId,
      content: parentComment.newReplyText,
      parentCommentId: parentComment.commentId
    };

    this.postService.addComment(post.postId, request).subscribe({
      next: (newComment) => {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        newComment.isLikedByMe = newComment.likedByUserIds ? newComment.likedByUserIds.includes(userId) : false;
        parentComment.replies.push(newComment);
        parentComment.newReplyText = '';
        parentComment.showReplyInput = false;
        post.commentsCount++;
      },
      error: (err) => {
        console.error('Error adding reply:', err);
      }
    });
  }

  addComment(post: Post): void {
    if (this.currentUserId === null || !post.newCommentText || post.newCommentText.trim() === '') {
      return;
    }

    const content = post.newCommentText.trim();
    post.newCommentText = '';

    this.postService.addComment(post.postId, {
      userId: this.currentUserId,
      content: content
    }).subscribe({
      next: (newComment) => {
        post.commentsCount++;
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        post.showComments = true;
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }
}
