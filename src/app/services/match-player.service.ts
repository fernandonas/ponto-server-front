import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchPlayerService {
  private readonly httpClient = inject(HttpClient);

  getUsers(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/users`);
  }

  getByMatch(matchId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/matches/${matchId}/players`);
  }

  add(matchId: string, userId: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/matches/${matchId}/players`, { userId });
  }

  remove(matchId: string, userId: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/matches/${matchId}/players/${userId}`);
  }
}