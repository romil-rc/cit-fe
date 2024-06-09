import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public fetchLocations = new BehaviorSubject<any>(null);

  private apiUrl = 'https://api.geoapify.com/v1/geocode';
  private apiKey = 'f564060db10d472ab67d17dea7455deb';

  constructor(private http: HttpClient) { }

  public searchByLatLong(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}/reverse?lat=${latitude}&lon=${longitude}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  public searchByAddress(location: string): Observable<any> {
    const url = `${this.apiUrl}/search?text=${location}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  public getLocations(): Observable<any> {
    const url = 'http://localhost:3000/api/location/';
    return this.http.get<any>(url);
  }

  public saveLocation(body: any): Observable<any> {
    const url = 'http://localhost:3000/api/location/';
    return this.http.post<any>(url, body);
  }

  public updateLocation(id: string | null, body: any): Observable<any> {
    const url = 'http://localhost:3000/api/location/' + id;
    return this.http.patch<any>(url, body);
  }

  public getALocation(id: string): Observable<any> {
    const url = 'http://localhost:3000/api/location/' + id;
    return this.http.get<any>(url);
  }

  public deleteLocation(id: string): Observable<any> {
    const url = 'http://localhost:3000/api/location/' + id;
    return this.http.delete<any>(url);
  }

}
