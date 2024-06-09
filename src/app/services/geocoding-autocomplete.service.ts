import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingAutocompleteService {

  private apiUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';
  private apiKey = 'f564060db10d472ab67d17dea7455deb';

  constructor(private http: HttpClient) { }

  public autocomplete(searchString: string): Observable<string[]> {
    const params = {
      text: searchString,
      apiKey: this.apiKey
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.features.map((feature: any) => feature.properties.formatted))
    );
  }

}
