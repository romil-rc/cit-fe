import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from '../../../../models/location.model';
import { MapService } from '../../../../services/map.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.css'
})
export class LocationListComponent {

  @Input() data!: LocationModel;

  constructor(private router: Router, private mapService: MapService) { }

  public navigateToLocation(locationId: string): void {
    this.router.navigateByUrl('/locations/'+locationId);
  }

  public deleteLocation(locationId: string) {
    this.mapService.deleteLocation(locationId).subscribe({
      next: (res) => {
        this.mapService.fetchLocations.next(res);
        console.log(res);
      },
      error: (err) => {
        throw new Error(err);
      }
    })
  }
}
