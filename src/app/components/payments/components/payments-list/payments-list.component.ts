import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.css'
})
export class PaymentsListComponent implements OnInit {

  public paymentDetails: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.fetchPaymentsList();
  }

  private fetchPaymentsList(): void {
    this.paymentService.getAllPayments('db').subscribe({
      next: (res) => {
        this.paymentDetails = res;
      },
      error: (err) => {
        throw err;
      }
    })
  }
}
