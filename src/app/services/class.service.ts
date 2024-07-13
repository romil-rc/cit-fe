import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  public getAllClasses(): Observable<any> {
    const url = 'http://localhost:3000/api/class/';
    return this.http.get<any>(url);
  }
}
