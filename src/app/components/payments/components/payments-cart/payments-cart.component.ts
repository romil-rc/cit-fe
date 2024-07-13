import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { ClassService } from '../../../../services/class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments-cart',
  templateUrl: './payments-cart.component.html',
  styleUrl: './payments-cart.component.css'
})
export class PaymentsCartComponent implements OnInit {

  public data: any;
  public classId!: string;
  public paymentRequest!: google.payments.api.PaymentDataRequest;

  constructor(private paymentService: PaymentService, private classService: ClassService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.fetchClasses();
    this.paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              gatewayMerchantId: 'pk_test_51PSIEfGtzv6pH5HJTDJMVp60hXZvkaScxZtC2s5WoldwrKNYiEF2fWiqypAQU3wbsNKVtcXxhIEP6jpwBUzT3mOy00VVDqVYhA'
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '100.00',
        currencyCode: 'USD',
        countryCode: 'US'
      },
      callbackIntents: ['PAYMENT_AUTHORIZATION']
    };
  }

  public fetchClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (response) => {
        this.data = response.data;
      },
      error: (err) => {
        throw err;
      }
    })
  }

  public bookClass(classId: string, paymentGateway: string) {
    this.addPayment(classId, paymentGateway);
  }

  public addPayment(classId: string, paymentGateway: string) {
    // const payment = {
    //   items: [
    //     {id: 1, quantity: 8},
    //     {id: 2, quantity: 7}
    //   ]
    // };
    // console.log(classId);
    this.paymentService.addPayment({classId, paymentGateway}).subscribe({
      next: (res) => {
        if(paymentGateway === 'stripe') {
          window.location = res.url;
        } else if (paymentGateway === 'razorpay') {
          // console.log(res);
          this.paymentService.initiateRazorpayPayment(res.orderId, res.amount);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public navigateTo(location: string) {
    this.router.navigate(['payments', location]);
  }

  public checkOut(classId: string): void {
    this.router.navigate(['payments', classId, 'checkout']);
  }

  onLoadPaymentData = (event: Event): void => {
    const eventDetail = event as CustomEvent<google.payments.api.PaymentData>
    const paymentData = eventDetail.detail;
    const token = paymentData.paymentMethodData.tokenizationData.token;
    this.paymentService.processGooglePayments(token).subscribe({
      next: (response: any) => {
        console.log('Payment successful', response);
      },
      error: (error: any) => {
        console.log(error);
        throw error;
      }
    });
  }

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = (paymentData) => {
    console.log(paymentData);
    return { transactionState: 'SUCCESS'};
  }

  onError = (event: ErrorEvent) => {
    console.log(event);
  }
}
