import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  public addPayment(body: any): Observable<any> {
    const url = 'https://cit-be.onrender.com/api/payment/';
    return this.http.post<any>(url, body);
  }

  public getAllPayments(): Observable<any> {
    const url = 'https://cit-be.onrender.com/api/payment/';
    return this.http.get<any>(url);
  }
}
