import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../../services/payment.service';

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.css'
})
export class PaymentCheckoutComponent implements OnInit {

  public userName = '';
  public userEmail = '';
  public selectedOption = '';
  public classId: string | null = '';

  constructor(private route: ActivatedRoute, private paymentService: PaymentService, private router: Router) {
  }

  ngOnInit(): void {
    this.selectedOption = 'stripe';
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('id');
    });
  }

  public onSubmit(): void {
    console.log('Name:', this.userName);
    console.log('Email:', this.userEmail);
    console.log(this.selectedOption);
    console.log(this.classId);
    if(this.selectedOption === 'razorpayCard') {
      this.router.navigate(['payments', this.classId, 'checkout', 'razorpay-card']);
    } else {
      this.paymentService.addPayment({classId: this.classId, paymentGateway: this.selectedOption}).subscribe({
        next: (res) => {
          if(this.selectedOption === 'stripe') {
            window.location = res.url;
          } else if (this.selectedOption === 'razorpay') {
            console.log(res);
            this.paymentService.initiateRazorpayPayment(res.orderId, res.amount);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
