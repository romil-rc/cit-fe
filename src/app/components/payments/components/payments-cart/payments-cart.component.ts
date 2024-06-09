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

  constructor(private paymentService: PaymentService, private classService: ClassService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.fetchClasses();
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

  public bookClass(classId: string) {
    this.addPayment(classId);
  }

  public addPayment(classId: string) {
    // const payment = {
    //   items: [
    //     {id: 1, quantity: 8},
    //     {id: 2, quantity: 7}
    //   ]
    // };
    console.log(classId);
    this.paymentService.addPayment({classId}).subscribe({
      next: (res) => {
        window.location = res.url;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public navigateTo(location: string) {
    this.router.navigate(['payments', location]);
  }
}
