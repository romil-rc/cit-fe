import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const Razorpay: any;

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

  public initiateRazorpayPayment(orderId: string, amount: number) {
    const options: any = {
      key: 'rzp_test_kdXlkz2Tyzmf81', // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      name: 'Class In Town',
      description: 'Payment for Order',
      order_id: orderId, // Pass the order ID generated on the server
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Most Used Methods',
              instruments: [
                {
                  method: 'wallet',
                  wallets: ['freecharge']
                },
                {
                    method: 'upi'
                },
                ],
            },
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: (response: any) => {
        alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
      },
      modal: {
        ondismiss: () => {
          alert('Payment cancelled.');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
