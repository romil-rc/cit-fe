import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationsComponent } from './components/locations/locations.component';
import { LocationListComponent } from './components/locations/components/location-list/location-list.component';
import { ChatsComponent } from './components/chats/chats.component';
import { HomeComponent } from './components/home/home.component';
import { LocationComponent } from './components/locations/components/location/location.component';
import { TranslateModule } from '@ngx-translate/core';
import { StreamAutocompleteTextareaModule, StreamChatModule } from 'stream-chat-angular';
import { MessageComponent } from './components/chats/components/message/message.component';
import { ChannelPreviewComponent } from './components/chats/components/channel-preview/channel-preview.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PaymentsListComponent } from './components/payments/components/payments-list/payments-list.component';
import { PaymentsCartComponent } from './components/payments/components/payments-cart/payments-cart.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LocationsComponent,
    LocationListComponent,
    ChatsComponent,
    HomeComponent,
    LocationComponent,
    MessageComponent,
    ChannelPreviewComponent,
    PaymentsComponent,
    PaymentsListComponent,
    PaymentsCartComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    GooglePayButtonModule,
    TranslateModule.forRoot(),
    StreamAutocompleteTextareaModule,
    StreamChatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
