import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCartComponent } from './payments-cart.component';

describe('PaymentsCartComponent', () => {
  let component: PaymentsCartComponent;
  let fixture: ComponentFixture<PaymentsCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
