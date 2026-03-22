import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {

  private apiUrl = 'http://localhost:8000/api/terrains';

  constructor(private http: HttpClient) {}

  getTerrains(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}