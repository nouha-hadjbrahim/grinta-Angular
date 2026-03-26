import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {
  Program,
  Exercise,
  GenerateProgramsRequest,
  GenerateProgramsResponse,
  GeneratedPrograms
} from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'http://localhost:8000/api';
  private generatedProgramsCache = new Map<string, Observable<GeneratedPrograms>>();

  constructor(private http: HttpClient) {}

  generatePrograms(muscles: string[], equipment: string[]): Observable<GeneratedPrograms> {
    const cacheKey = this.getCacheKey(muscles, equipment);

    if (this.generatedProgramsCache.has(cacheKey)) {
      return this.generatedProgramsCache.get(cacheKey)!;
    }

    const request: GenerateProgramsRequest = { muscles, equipment };

    const observable$ = this.http
      .post<GenerateProgramsResponse>(`${this.apiUrl}/programs/generate`, request)
      .pipe(
        map(res => {
          console.log(res);
          return res.programs;
        }),
        shareReplay(1),
        catchError((error) => {
          console.error('Error generating programs:', error);
          throw error;
        })
      );

    this.generatedProgramsCache.set(cacheKey, observable$);
    return observable$;
  }

  getProgram(id: number): Observable<Program> {
    return this.http.get<Program>(`${this.apiUrl}/programs/${id}`).pipe(
      catchError((error) => {
        console.error('Error loading program:', error);
        throw error;
      })
    );
  }

  getExercise(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/exercises/${id}`).pipe(
      catchError((error) => {
        console.error('Error loading exercise:', error);
        throw error;
      })
    );
  }

  updateExerciseCompletion(exerciseId: number, completed: boolean): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/exercises/${exerciseId}`, { completed })
      .pipe(
        catchError((error) => {
          console.error('Error updating exercise:', error);
          throw error;
        })
      );
  }

  updateProgramProgress(programId: number, progress: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/programs/${programId}`, { progress })
      .pipe(
        catchError((error) => {
          console.error('Error updating program progress:', error);
          throw error;
        })
      );
  }

  clearCache(): void {
    this.generatedProgramsCache.clear();
  }

  private getCacheKey(muscles: string[], equipment: string[]): string {
    const sortedMuscles = [...muscles].sort().join(',');
    const sortedEquipment = [...equipment].sort().join(',');
    return `${sortedMuscles}|${sortedEquipment}`;
  }
}
