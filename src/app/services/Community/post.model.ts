export interface PostImage {
    imageId: number;
    imageUrl: string;
    order: number;
}

export interface PostComment {
    commentId: number;
    postId: number;
    userId: number;
    userEmail: string;
    content: string;
    createdAt: Date;
    parentCommentId?: number | null;
    likesCount: number;
    likedByUserIds: number[];
    replies?: PostComment[];
    showReplyInput?: boolean;
    replyText?: string;
    newReplyText?: string;
    isLikedByMe?: boolean;
}

export interface CreateCommentRequest {
    userId: number;
    content: string;
    parentCommentId?: number | null;
}

export interface CreatePostRequest {
    userId: number;
    content: string;
    type: string;
}

export interface UserSummary {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    postId: number;
    userId: number;
    userEmail: string;
    content: string;
    createdAt: Date;
    images?: PostImage[];
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    type: string;
    likedByUserIds: number[];
    likedByUsers?: UserSummary[];
    
    // Frontend-specific state properties
    showComments?: boolean;
    comments?: PostComment[];
    newCommentText?: string;
    isLikedByMe?: boolean;
    imageUrl?: string; // Optional fallback if old code still checks it somehow
}
