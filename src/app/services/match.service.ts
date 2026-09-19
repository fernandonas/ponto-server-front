import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly httpClient = inject(HttpClient);

  post(payload: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/matches`, payload);
  }

  getAll(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/matches`);
  }

  getMyUpcoming(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/matches/my-upcoming`);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/matches/${id}`);
  }

  put(id: string, payload: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/matches/${id}`, payload);
  }
}