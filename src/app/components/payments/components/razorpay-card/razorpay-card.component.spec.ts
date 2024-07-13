import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpayCardComponent } from './razorpay-card.component';

describe('RazorpayCardComponent', () => {
  let component: RazorpayCardComponent;
  let fixture: ComponentFixture<RazorpayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RazorpayCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RazorpayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
