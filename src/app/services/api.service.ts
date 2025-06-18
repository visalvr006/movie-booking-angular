import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Auth endpoints
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Movie endpoints
  getMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies`);
  }

  getMovieById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${id}`);
  }

  getBookedSeats(movieId?: string, date?: string, time?: string, theater?: string): Observable<any> {
    let params = new URLSearchParams();
    if (movieId) params.append('movieId', movieId);
    if (date) {
      // Ensure date is in YYYY-MM-DD format
      const dateObj = new Date(date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      params.append('date', formattedDate);
    }
    if (time) params.append('time', time);
    if (theater) params.append('theater', theater);

    return this.http.get(`${this.apiUrl}/seats`, { params: params as any });
  }

  bookTicket(bookingDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingDetails);
  }

  getTheaters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/theaters`);
  }

  // Bookings
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }
} 