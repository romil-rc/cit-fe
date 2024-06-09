import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, private paymentService: PaymentService) {}

  public navigateTo(place: string) {
    this.router.navigateByUrl(`/${place}`);
  }

}
