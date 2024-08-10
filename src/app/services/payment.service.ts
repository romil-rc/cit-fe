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

  public getAllPayments(gateway: string): Observable<any> {
    const url = 'https://cit-be.onrender.com/api/payment/' + '?type='+gateway;
    return this.http.get<any>(url);
  }

  public processGooglePayments(token: any): Observable<any> {
    const url = 'http://localhost:3000/api/payment/gpay-process-payment';
    return this.http.post<any>(url, token);
  }

  public downloadPaymentReceipt(paymentId: string): Observable<any> {
    const url = 'https://cit-be.onrender.com/api/payment/' + paymentId + '/download-receipt';
    return this.http.post<any>(url, {currency: '$'});
  }

  public downloadReport(response: any, type: string): void {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const decodedContent = window.atob(response.result);
    const byteArray = new Uint8Array(decodedContent.length);
    for (let i = 0; i < decodedContent.length; i++) {
      byteArray[i] = decodedContent.charCodeAt(i);
    }
    // tslint:disable-next-line:one-variable-per-declaration
    const blob = new Blob([byteArray.buffer],
      {type: 'pdf'}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.target = '_blank';
    a.download = response.fileName + '.' +  type;
    a.click();
    a.remove();
  }

  public initiateRazorpayPayment(orderId: string, amount: number) {
    const options: any = {
      key: 'rzp_live_AmpQY2tGNDYHJJ', // Enter the Key ID generated from the Dashboard
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
