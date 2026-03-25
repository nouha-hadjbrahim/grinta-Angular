import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../services/Community/post.service';
import { AuthService } from '../../../services/User/auth.service';
import { Post, PostComment, CreateCommentRequest } from '../../../services/Community/post.model';
import { ChallengeService } from '../../../services/Community/challenge.service';
import { Challenge } from '../../../services/Community/challenge.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  posts: Post[] = [];
  challenges: Challenge[] = [];
  loading = true;
  error = '';
  currentUserId: number | null = null;
  currentUserEmail: string = '';

  activeTab: string = 'feed';
  activeCategory: string = 'Everything';

  categories = [
    { name: 'Everything', icon: 'fas fa-border-all' },
    { name: 'Training', icon: 'fas fa-dumbbell' },
    { name: 'Nutrition', icon: 'fas fa-apple-alt' },
    { name: 'Events', icon: 'fas fa-calendar-alt' }
  ];

  constructor(
    private postService: PostService,
    private challengeService: ChallengeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserEmail = this.authService.getCurrentUserEmail() || '';
    this.loadPosts();
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getCommunityChallenges().subscribe({
      next: (data) => {
        // Sort challenges: trending first, then by earliest end date
        let sorted = data.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          
          if (a.endDate && b.endDate) {
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          }
          return 0;
        });

        // Map joined state if we have a current user
        if (this.currentUserId) {
          this.challengeService.getJoinedChallengeIds(this.currentUserId).subscribe({
            next: (joinedIds) => {
              this.challenges = sorted.map(ch => ({
                ...ch,
                isJoined: ch.challengeId ? joinedIds.includes(ch.challengeId) : false
              }));
            },
            error: (err) => {
              console.error('Error fetching joined challenges', err);
              this.challenges = sorted;
            }
          });
        } else {
          this.challenges = sorted;
        }
      },
      error: (err) => {
        console.error('Error loading challenges:', err);
      }
    });
  }

  joinChallengeAction(challenge: Challenge): void {
    if (!this.currentUserId || !challenge.challengeId || challenge.isJoined) return;

    challenge.isJoined = true;
    challenge.participantsCount = (challenge.participantsCount || 0) + 1;
    this.challengeService.joinChallenge(challenge.challengeId, this.currentUserId).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Failed to join challenge', err);
        challenge.isJoined = false;
        challenge.participantsCount!--;
      }
    });
  }

  getDaysLeft(endDate: string | Date | undefined): string {
    if (!endDate) return 'No limit';
    
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return '1 day';
    
    return `${diffDays} days`;
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data.map(post => {
          post.showComments = false;
          post.comments = [];
          post.newCommentText = '';
          post.isLikedByMe = false;
          if (this.currentUserId) {
            post.isLikedByMe = post.likedByUserIds.includes(this.currentUserId);
          }
          return post;
        });
        
        this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.error = 'Failed to load community feed. Please try again later.';
        this.loading = false;
      }
    });
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  toggleLike(post: Post): void {
    if (!this.currentUserId) return;
    
    const wasLiked = post.isLikedByMe;
    
    if (wasLiked) {
      post.likesCount--;
      post.isLikedByMe = false;
    } else {
      post.likesCount++;
      post.isLikedByMe = true;
    }

    this.postService.toggleLike(post.postId, this.currentUserId).subscribe({
      error: (err) => {
        console.error('Error toggling like:', err);
        if (wasLiked) {
          post.likesCount++;
          post.isLikedByMe = true;
        } else {
          post.likesCount--;
          post.isLikedByMe = false;
        }
      }
    });
  }

  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
    if (post.showComments && (!post.comments || post.comments.length === 0)) {
      this.postService.getComments(post.postId).subscribe({
        next: (comments) => {
          post.comments = this.organizeComments(comments);
        },
        error: (err) => console.error('Error loading comments', err)
      });
    }
  }

  organizeComments(flatComments: PostComment[]): PostComment[] {
    const commentMap = new Map<number, PostComment>();
    const roots: PostComment[] = [];

    flatComments.forEach(c => {
      c.replies = [];
      c.showReplyInput = false;
      c.newReplyText = '';
      if (this.currentUserId) {
        c.isLikedByMe = c.likedByUserIds ? c.likedByUserIds.includes(this.currentUserId) : false;
      } else {
        c.isLikedByMe = false;
      }
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

  addComment(post: Post): void {
    if (this.currentUserId === null || !post.newCommentText || post.newCommentText.trim() === '') {
      return;
    }

    const content = post.newCommentText.trim();
    post.newCommentText = '';

    const request: CreateCommentRequest = {
      userId: this.currentUserId,
      content: content,
      parentCommentId: null
    };

    this.postService.addComment(post.postId, request).subscribe({
      next: (newComment: PostComment) => {
        newComment.replies = [];
        newComment.showReplyInput = false;
        newComment.newReplyText = '';
        newComment.isLikedByMe = false;
        
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        post.showComments = true;
        post.commentsCount++;
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }

  toggleCommentLike(comment: PostComment): void {
    if (!this.currentUserId) return;

    const wasLiked = comment.isLikedByMe;

    if (wasLiked) {
      comment.likesCount--;
      comment.isLikedByMe = false;
    } else {
      comment.likesCount++;
      comment.isLikedByMe = true;
    }

    this.postService.toggleCommentLike(comment.commentId, this.currentUserId).subscribe({
      error: (err) => {
        console.error('Error toggling comment like', err);
        if (wasLiked) {
          comment.likesCount++;
          comment.isLikedByMe = true;
        } else {
          comment.likesCount--;
          comment.isLikedByMe = false;
        }
      }
    });
  }

  toggleReplyInput(comment: PostComment): void {
    comment.showReplyInput = !comment.showReplyInput;
  }

  submitReply(post: Post, parentComment: PostComment): void {
    if (this.currentUserId === null || !parentComment.newReplyText || parentComment.newReplyText.trim() === '') {
      return;
    }

    const content = parentComment.newReplyText.trim();
    parentComment.newReplyText = '';
    
    const request: CreateCommentRequest = {
      userId: this.currentUserId,
      content: content,
      parentCommentId: parentComment.commentId
    };

    this.postService.addComment(post.postId, request).subscribe({
      next: (newComment: PostComment) => {
        newComment.replies = [];
        newComment.showReplyInput = false;
        newComment.newReplyText = '';
        newComment.isLikedByMe = false;

        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(newComment);
        parentComment.showReplyInput = false;
        post.commentsCount++;
      },
      error: (err) => console.error('Error adding reply', err)
    });
  }

  getAvatarInitials(email: string): string {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return d.toLocaleDateString();
    }
  }

  getAbsoluteImageUrl(imgName?: string): string {
    if (!imgName) return '';
    return imgName.includes('http') || imgName.startsWith('data:') ? imgName : `http://localhost:8000/uploads/${imgName}`;
  }
}
