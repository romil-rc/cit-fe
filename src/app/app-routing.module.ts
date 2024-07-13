import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { LocationsComponent } from './components/locations/locations.component';
import { ChatsComponent } from './components/chats/chats.component';
import { HomeComponent } from './components/home/home.component';
import { LocationComponent } from './components/locations/components/location/location.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PaymentsListComponent } from './components/payments/components/payments-list/payments-list.component';
import { PaymentsCartComponent } from './components/payments/components/payments-cart/payments-cart.component';
import { PaymentCheckoutComponent } from './components/payments/components/payment-checkout/payment-checkout.component';
import { RazorpayCardComponent } from './components/payments/components/razorpay-card/razorpay-card.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'locations', 
    component: LocationsComponent,
    children: [
      { path: '', component: LocationComponent },
      { path: 'add-class', component: MapComponent },
      { path: ':id', component: MapComponent }
    ]
  },
  { path: 'chats', component: ChatsComponent },
  { 
    path: 'payments', 
    component: PaymentsComponent,
    children: [
      { path: '', component: PaymentsCartComponent },
      { path: 'payments-list', component: PaymentsListComponent },
      { path: ':id/checkout', component: PaymentCheckoutComponent },
      { path: ':id/checkout/razorpay-card', component: RazorpayCardComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
