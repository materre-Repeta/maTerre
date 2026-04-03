import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = 'http://localhost:8081/api/verify';

  constructor(private http: HttpClient) {}

  submitRequest(titleNumber: string): Observable<any> {
    const params = new HttpParams().set('titleNumber', titleNumber);
    return this.http.post(`${this.apiUrl}/request`, {}, { params });
  }

  getPropertyStatus(titleNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${titleNumber}`);
  }

  getReport(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/report/${requestId}`);
  }

  downloadReport(requestId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/${requestId}/download`, {
      responseType: 'blob'
    });
  }
}
