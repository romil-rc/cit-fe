import { Component } from '@angular/core';
import { LocationModel } from '../../../../models/location.model';
import { Router } from '@angular/router';
import { MapService } from '../../../../services/map.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  public locations: LocationModel[] = [];

  constructor(private router: Router, private mapService: MapService){
  }

  ngOnInit(): void {
    this.mapService.fetchLocations.subscribe(() => {
      this.getAllLocations();
    });
  }

  public addNewLocation(): void {
    this.router.navigateByUrl('/locations/add-class');
  }

  private getAllLocations(): void {
    this.mapService.getLocations().subscribe({
      next:(response) => {
        if(response.status === 'success') {
            this.locations = response.data;
        } else {
          throw new Error(response.status);
        }
      },
      error: (err) => {
        throw err;
      }
    })
  }
}
