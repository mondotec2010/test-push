import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService) { }

  findAreaService(query: string): Observable<any> {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&polygon_geojson=1`);
  }
  
}
