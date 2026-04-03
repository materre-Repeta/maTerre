import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8081/api/properties';

  constructor(private http: HttpClient) {}

  getCertifiedProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/certified`);
  }

  getProperty(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
