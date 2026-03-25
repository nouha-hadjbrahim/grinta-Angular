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
