import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VenueService {
  private readonly httpClient = inject(HttpClient);

  post(payload: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/venues`, payload);
  }

  getAll(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/venues`);
  }

  findAllSimple(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/venues/all-simple`);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/venues/${id}`);
  }

  put(id: string, payload: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/venues/${id}`, payload);
  }
}
