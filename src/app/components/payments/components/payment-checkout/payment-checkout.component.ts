import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../../services/payment.service';
import { interval, map, takeWhile } from 'rxjs';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.css'
})
export class PaymentCheckoutComponent {
  public userName = '';
  public userEmail = '';
  public selectedOption = '';
  public classId: string | null = '';
  public showQR = false;
  public remainingTime: number = 150;
  public interval$: any;
  public timerDisplay: string = '';

  constructor(private route: ActivatedRoute, private paymentService: PaymentService, private router: Router) {
  }

  ngOnInit(): void {
    this.selectedOption = 'stripe';
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('id');
    });
  }

  public onSubmit(): void {
    if(this.selectedOption === 'razorpayCard') {
      this.router.navigate(['payments', this.classId, 'checkout', 'razorpay-card']);
    } else {
      this.paymentService.addPayment({classId: this.classId, paymentGateway: this.selectedOption, userDetail: {email: this.userEmail, name: this.userName}}).subscribe({
        next: (res) => {
          if(this.selectedOption === 'stripe' || this.selectedOption === 'razorpayUPI') {
            window.location = res.url;
          } else if (this.selectedOption === 'razorpay') {
            this.paymentService.initiateRazorpayPayment(res.orderId, res.amount);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  public generateQR(): void {
    this.showQR = true;
    this.startTimer();
  }

  public startTimer() {
    this.interval$ = interval(1000).pipe(
      map(() => --this.remainingTime),
      takeWhile(() => this.remainingTime >= 0)
    ).subscribe(() => {
      this.timerDisplay = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime === 0) {
        this.showQR = false;
        this.router.navigate(['payments']);
      }
    });
  }

  public getSecondsAsDigitalClock(inputSeconds: number): string {
    const minutes = Math.floor(inputSeconds / 60);
    const seconds = inputSeconds % 60;
    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  public padTime(time: number): string {
    return (time < 10 ? '0' : '') + time;
  }

  ngOnDestroy() {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
  }

}
