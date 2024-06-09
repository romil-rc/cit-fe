import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../../services/map.service';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { GeocodingAutocompleteService } from '../../services/geocoding-autocomplete.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationModel } from '../../models/location.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  public map!: Map;
  public marker!: Marker;
  public markerId: string | null = null;
  public currentLocation: any;
  public selectedLocation!: string;
  public isSearched = false;
  public className: string = '';
  public locationId!: string | null;
  public locationForm: FormGroup;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  private isInitialLocation = false;

  constructor(private mapService: MapService, private geocodingAutocompleteService: GeocodingAutocompleteService,
    private formBuilder: FormBuilder, public router: Router, private activatedRoute: ActivatedRoute) {
    this.locationForm = this.formBuilder.group({
      locationName: ['', [Validators.required]],
      address: this.formBuilder.group({
        addressLine1: [''],
        addressLine2: [''],
        suburb: [''],
        city: [''],
        pincode: ['', Validators.maxLength(6)],
        state: [''],
        country: [''],
        county: ['']
      }),
      coordinates: this.formBuilder.group({
        latitude: [''],
        longitude: ['']
      }),
      formattedAddress: [''],
      locationId: [''],
      capacity: [''],
      accessibility: [''],
      openingHours: [''],
      events: [['']],
      facilities: [['']],
      contactInfo: this.formBuilder.group({
        email: [''],
        phoneNumber: ['', Validators.maxLength(10)]
      }),
      rating: ['']
    });
  }

  ngOnInit(): void {
    this.locationId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.locationId) {
      this.fetchLocation(this.locationId);
    }
  }

  ngAfterViewInit() {
    if(this.router.url.includes('add-class')) {
      const initialState = { lng: -73.935242, lat: 40.730610, zoom: 14 };
      this.getInitialLocation(initialState);
      this.isInitialLocation = true;
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  public formatter = (result: string) => result;

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term.length > 3 ?
        this.geocodingAutocompleteService.autocomplete(term).pipe(
          map(res => {
            this.isSearched = true;
            return res;
          })
        ) : of([])
      )
    );

  public onSelectLocation(): void {
    console.log(this.selectedLocation.length);
    if(this.selectedLocation.length > 3) {
      this.mapService.searchByAddress(this.selectedLocation).subscribe({
        next:(result) => {
          if(result) {
            this.currentLocation = result.features[0].properties;
            this.createMap({
              lng: this.currentLocation.lon, 
              lat: this.currentLocation.lat, 
              zoom: 14
            });
            this.setMarkerOnClick();
            this.isSearched = false;
            this.setLocationInForm(this.currentLocation);
          }
        },
        error: (err) => {
          throw err;
        }
      });
    }
  }

  public saveLocation(isNew: boolean): void {
    console.log(isNew);
    if(isNew) {
      if(this.locationForm.valid) {
        const location = new LocationModel(this.locationForm.value);
        console.log(location);
        this.mapService.saveLocation(location).subscribe({
          next:(response) => {
            console.log(response);
            if(response.status === 'success') {
              this.router.navigateByUrl('/locations').then().catch();
            } else {
              throw response.status;
            }
          },
          error:(err) => {
            throw err;
          }
        });
      }
    } else {
      console.log(this.locationForm);
      if(this.locationForm.valid) {
        const location = new LocationModel(this.locationForm.value);
        console.log(location);
        this.mapService.updateLocation(this.locationId, location).subscribe({
          next:(response) => {
            console.log(response);
            if(response.status === 'success') {
              this.router.navigateByUrl('/locations').then().catch();
            } else {
              throw response.status;
            }
          },
          error:(err) => {
            throw err;
          }
        });
      }
    }
  }

  private createMap(coordinates: {lng: number, lat: number, zoom: number}): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=f564060db10d472ab67d17dea7455deb`,
      center: [coordinates.lng, coordinates.lat],
      zoom: coordinates.zoom
    });
    this.map.addControl(new NavigationControl(), 'top-right');
    this.marker = new Marker({color: "#FF0000"})
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(this.map);
  }

  private setMarkerOnClick(): void {
    this.map.on('click', (event: any) => {
      const clickedCoordinates = event.lngLat.toArray();
      this.marker.setLngLat([clickedCoordinates[0], clickedCoordinates[1]]);
      this.mapService.searchByLatLong(clickedCoordinates[1], clickedCoordinates[0]).subscribe({
        next:(result) => {
          this.currentLocation = result.features[0].properties;
          if(result) {
            console.log(this.currentLocation);
            this.setLocationInForm(this.currentLocation);
          }
        }, 
        error: (err) => {
          throw err;
        }
      });
    });
  }

  private getInitialLocation(initialState: {lng: number, lat: number, zoom: number}) {
    console.log(initialState);  
    this.mapService.searchByLatLong(initialState.lat, initialState.lng).subscribe({
      next:(result) => {
        this.currentLocation = result.features[0].properties;
        this.createMap(initialState);
        this.setMarkerOnClick();
        if(this.isInitialLocation) {
          console.log('its initial location');
          this.setLocationInForm(this.currentLocation);
        }
      }, 
      error: (err) => {
        throw err;
      }
    });
  }

  private fetchLocation(locationId: string) {
    this.mapService.getALocation(locationId).subscribe({
      next: (response) => {
        const location = new LocationModel(response.data);
        this.setLocationInForm(location);
        this.setDataInForm(location);
        this.getInitialLocation({
          lng: response.data.coordinates.longitude, 
          lat: response.data.coordinates.latitude,
          zoom: 14
        });
      },
      error: (err) => {
        throw new Error(err);
      }
    })
  }
  
  private setDataInForm(currentLocation: any): void {
    console.log(currentLocation);
    const formValue = this.locationForm.value;
    this.locationForm.patchValue({
      locationName: currentLocation.locationName ? currentLocation.locationName : formValue.locationName,
      capacity: currentLocation.capacity ? currentLocation.capacity : '',
      accessibility: currentLocation.accessibility ? currentLocation.accessibility : '',
      openingHours: currentLocation.openingHours ? currentLocation.openingHours : '',
      events: currentLocation.events ? currentLocation.events : '',
      facilities: currentLocation.facilities ? currentLocation.facilities : '',
      contactInfo: {
        email: currentLocation?.contactInfo?.email ? currentLocation.contactInfo.email : '',
        phoneNumber: currentLocation?.contactInfo?.phoneNumber ? currentLocation.contactInfo.phoneNumber : ''
      }
    });
  }
  
  private setLocationInForm(currentLocation: any): void {
    console.log(currentLocation);
    this.locationForm.patchValue({
      address: {
        addressLine1: currentLocation?.address?.addressLine1 ? currentLocation.address.addressLine1 : currentLocation.address_line1,
        addressLine2: currentLocation?.address?.addressLine2 ? currentLocation.address.addressLine2 : currentLocation.address_line2,
        suburb: currentLocation?.address?.suburb ? currentLocation.address.suburb : currentLocation.suburb,
        city: currentLocation?.address?.city ? currentLocation.address.city : currentLocation.city,
        pincode: currentLocation?.address?.pincode ? currentLocation.address.pincode : currentLocation.postcode,
        state: currentLocation?.address?.state ? currentLocation.address.state : currentLocation.state,
        country: currentLocation?.address?.country ? currentLocation.address.country : currentLocation.country,
        county: currentLocation?.address?.county ? currentLocation.address.county : currentLocation.county
      },
      coordinates: {
        latitude: currentLocation?.coordinates?.latitude ? currentLocation.coordinates.latitude : currentLocation.lat,
        longitude: currentLocation?.coordinates?.longitude ? currentLocation.coordinates.longitude : currentLocation.lon
      },
      formattedAddress: currentLocation.formattedAddress ? currentLocation.formattedAddress : currentLocation.formatted,
      locationId: currentLocation.locationId ? currentLocation.locationId : currentLocation.place_id,
      rating: currentLocation?.rating ? currentLocation.rating : currentLocation.rank.popularity
    });
  }

}
