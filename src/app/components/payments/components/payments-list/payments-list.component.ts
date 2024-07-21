import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.css'
})
export class PaymentsListComponent implements OnInit {

  public paymentDetails: any[] = [];
  public type!: string;

  constructor(private paymentService: PaymentService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.queryParams['type'];
    if(this.type) {
      this.fetchPaymentsList(this.type);
    }
  }

  private fetchPaymentsList(type: string): void {
    this.paymentService.getAllPayments(type).subscribe({
      next: (res) => {
        this.paymentDetails = res;
      },
      error: (err) => {
        throw err;
      }
    })
  }
}
