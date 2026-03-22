export interface Post {
  postId: number;
  userId: number;
  userEmail: string;
  content: string;
  createdAt: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  type: string;
  likedByUserIds?: number[];

  // Frontend-only properties for UI state
  showComments?: boolean;
  comments?: PostComment[];
  newCommentText?: string;
  isLikedByMe?: boolean;
}

export interface CreatePostRequest {
  userId: number;
  content: string;
  imageUrl?: string;
  type: string;
}

export interface PostComment {
  commentId: number;
  postId: number;
  userId: number;
  userEmail: string;
  content: string;
  createdAt: string;
  parentCommentId?: number;
  likesCount?: number;
  likedByUserIds?: number[];
  
  // Frontend-only properties for UI state
  isLikedByMe?: boolean;
  showReplyInput?: boolean;
  newReplyText?: string;
  replies?: PostComment[];
}

export interface CreateCommentRequest {
  userId: number;
  content: string;
  parentCommentId?: number;
}