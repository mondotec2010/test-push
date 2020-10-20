import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral} from '@agm/core';
import { Area } from 'src/app/model/area';

declare var google: any;

@Component({
  selector: 'app-detail-map-v2',
  templateUrl: './detail-map-v2.component.html',
  styleUrls: ['./detail-map-v2.component.css']
})
export class DetailMapV2Component implements OnInit, AfterViewInit  {
  @Input('senderId') senderId: string;
  @Input('aree') aree : Area[] = new Array<Area>();
//   @Input('aree') set aree(value: any) {
//     this.aree = value;
//     this.adjustBounds(value);
//  }
  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;
  map: any; // Reference alla mappa vera e propria
  geoJsonObject: any;
  paths: LatLngLiteral[] = new Array<LatLngLiteral>();
  shapes: any[] = new Array<any>();
  i : number = 0;
  bounds: LatLngBounds;

  ngAfterViewInit(): void {
    //console.log(this.aree[0].geomArea);
  }

  ngOnInit(): void {

  }

  clicked(clickEvent: any) {
    console.log(clickEvent);
  }

  styleFunc(feature) {
    return ({
      clickable: false,
      // fillColor: feature.getProperty('color'),
      fillColor: 'rgba(0, 0, 0, 0.486)',
      strokeColor: 'rgba(0, 0, 0, 0.400)',
      strokeWeight: 1
    });
  }

  onMapReady(map){
    // console.log("Map Ready.")
    this.map = map;
    map.setOptions({draggable: true, fullscreenControl: true});
    this.adjustBounds(this.aree);
  }

  adjustBounds(aree){
    this.aree = aree
    this.bounds = new google.maps.LatLngBounds();
    // console.log("adjustBounds() called")
    // console.log(this.aree)
    for (const area of this.aree)
    {
      for (const mm of area.geomArea.geometry.coordinates[0])
      {
        this.bounds.extend(new google.maps.LatLng(mm[1], mm[0]));
      }
    }
    this.map.fitBounds(this.bounds);
  }

}


