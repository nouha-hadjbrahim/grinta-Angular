import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, CreatePostRequest, PostComment, CreateCommentRequest } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = `${environment.apiUrl}/community/posts`;

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(request: any): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, request);
  }

  updatePost(id: number, request: any): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, request);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleLike(postId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/like?userId=${userId}`, {});
  }

  addComment(postId: number, request: CreateCommentRequest): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/${postId}/comments`, request);
  }

  toggleCommentLike(commentId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/comments/${commentId}/like?userId=${userId}`, {});
  }

  getComments(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiUrl}/${postId}/comments`);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }
}
