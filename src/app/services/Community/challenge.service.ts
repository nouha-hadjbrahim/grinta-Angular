import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Challenge } from './challenge.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = `${environment.apiUrl}/admin/challenges`;

  constructor(private http: HttpClient) { }

  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.apiUrl);
  }

  getCommunityChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${environment.apiUrl}/community/challenges`);
  }

  getJoinedChallengeIds(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${environment.apiUrl}/community/challenges/joined?userId=${userId}`);
  }

  joinChallenge(challengeId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/community/challenges/${challengeId}/join?userId=${userId}`, {});
  }

  leaveChallenge(challengeId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/community/challenges/${challengeId}/leave?userId=${userId}`);
  }

  getChallengeById(id: number): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/${id}`);
  }

  getChallengeParticipants(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/participants`);
  }

  createChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.post<Challenge>(this.apiUrl, challenge);
  }

  updateChallenge(id: number, challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.apiUrl}/${id}`, challenge);
  }

  deleteChallenge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
