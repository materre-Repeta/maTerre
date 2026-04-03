import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  sendOtp(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/send`, {}, {
      params: { phoneNumber }
    });
  }

  verifyOtp(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/verify`, { phoneNumber, otp }).pipe(
      tap((res: any) => this.setSession(res.token))
    );
  }

  private setSession(token: string) {
    localStorage.setItem('id_token', token);
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  public isLoggedIn() {
    return !!localStorage.getItem('id_token');
  }

  public getToken() {
    return localStorage.getItem('id_token');
  }
}
