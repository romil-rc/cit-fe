import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { CreditCardValidators } from 'angular-cc-library';

@Component({
  selector: 'app-razorpay-card',
  templateUrl: './razorpay-card.component.html',
  styleUrl: './razorpay-card.component.css'
})
export class RazorpayCardComponent implements OnInit {

// public formData!: FormGroup;
  // public classId: string | null = '';

  // constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private paymentService: PaymentService) {
  //   this.formData = this.formBuilder.group({
  //     cardNumber: ['', [Validators.required, Validators.maxLength(16)]],
  //     expiryDateMonth: ['', [Validators.required, Validators.maxLength(2)]],
  //     expiryDateYear: ['', [Validators.required, Validators.maxLength(2)]],
  //     cvc: ['', [Validators.required, Validators.maxLength(3)]],
  //     cardHolderName: ['', [Validators.required]]
  //   });
  // }

  // ngOnInit() {
  //   this.route.paramMap.subscribe(params => {
  //     this.classId = params.get('id');
  //   });
  // }

  // public submitForm(): void {
  //   if(this.formData.valid) {
  //     this.paymentService.addPayment({
  //       classId: this.classId, 
  //       paymentGateway: 'razorpay-card', 
  //       data: this.formData.value}).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         throw err;
  //       }
  //     });
  //   }
  // }

  // cardForm: FormGroup;
  // cardType: string | null = null;

  // constructor(private fb: FormBuilder) {
  //   this.cardForm = this.fb.group({
  //     cardNumber: ['', [Validators.required, this.cardNumberValidator.bind(this)]],
  //     expiryDate: ['', [Validators.required, this.expiryDateValidator]],
  //     cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
  //   });
  // }

  // onCardInput(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.cardType = input.dataset['cardType'] || null;
  // }

  // private cardNumberValidator(control: any): { [key: string]: any } | null {
  //   const cardNumber = control.value;
  //   const cardPatterns = {
  //     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  //     mastercard: /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[01][0-9]{13}|720[0-9]{12}))$/,
  //     amex: /^3[47][0-9]{13}$/,
  //     discover: /^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/
  //   };
  //   for (const pattern of Object.values(cardPatterns)) {
  //     if (pattern.test(cardNumber)) {
  //       return null;
  //     }
  //   }
  //   return { 'invalidCardNumber': true };
  // }

  // private expiryDateValidator(control: any): { [key: string]: any } | null {
  //   const currentDate = new Date();
  //   const [month, year] = control.value.split('/').map((str: string) => parseInt(str, 10));
  //   if (month < 1 || month > 12) {
  //     return { 'invalidExpiryDate': true };
  //   }
  //   const expiryDate = new Date(year, month - 1);
  //   if (expiryDate < currentDate) {
  //     return { 'expiredCard': true };
  //   }
  //   return null;
  // }

  public cardForm: FormGroup;
  public cardType: string | null = null;
  public classId: string | null = '';

  constructor(private fb: FormBuilder, private paymentService: PaymentService, private route: ActivatedRoute) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, CreditCardValidators.validateCCNumber]],
      expiryDate: ['', [Validators.required, this.expiryDateValidator]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
    });
  }

  ngOnInit(): void {
    this.cardForm.get('cardNumber')?.valueChanges.subscribe(value => {
      this.getCardType(value);
    });
    this.route.paramMap.subscribe(params => {
      this.classId = params.get('id');
    });
  }

  private getCardType(cardNumber: string): void {
    const ccNumber = cardNumber.replace(/ /g, '');
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(ccNumber)) {
      this.cardType = 'Visa';
    } else if (/^5[1-5][0-9]{14}$/.test(ccNumber) || /^2[2-7][0-9]{14}$/.test(ccNumber)) {
      this.cardType = 'MasterCard';
    } else if (/^3[47][0-9]{13}$/.test(ccNumber)) {
      this.cardType = 'American Express';
    } else if (/^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/.test(ccNumber)) {
      this.cardType = 'Discover';
    } else {
      this.cardType = null;
    }
  }

  private expiryDateValidator(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const [monthStr, yearStr] = value.split('/').map((str: string) => str.trim());
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (!month || !year || month < 1 || month > 12 || yearStr.length !== 2) {
      return { invalidExpiryDate: true };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JS
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the current year

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredCard: true };
    }

    return null;
  }

    public submitForm(): void {
    if(this.cardForm.valid) {
      this.paymentService.addPayment({
        classId: this.classId, 
        paymentGateway: 'razorpay-card', 
        data: this.cardForm.value}).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
          throw err;
        }
      });
    }
  }

}
