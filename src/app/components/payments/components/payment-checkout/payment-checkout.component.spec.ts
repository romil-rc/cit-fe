import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCheckoutComponent } from './payment-checkout.component';

describe('PaymentCheckoutComponent', () => {
  let component: PaymentCheckoutComponent;
  let fixture: ComponentFixture<PaymentCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentCheckoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
