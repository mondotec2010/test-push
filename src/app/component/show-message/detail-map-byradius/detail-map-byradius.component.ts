import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral} from '@agm/core';
import { Area } from 'src/app/model/area';
import { Circle } from '../../map-drawing-radius-tool/model/circle';

declare var google: any;

@Component({
  selector: 'app-detail-map-byradius',
  templateUrl: './detail-map-byradius.component.html',
  styleUrls: ['./detail-map-byradius.component.css']
})
export class DetailMapByradiusComponent implements OnInit {

  @Input('senderId') senderId: string;
  @Input('circle') circle : Circle;
  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;
  map: any; // Reference alla mappa vera e propria
  geoJsonObject: any;
  paths: LatLngLiteral[] = new Array<LatLngLiteral>();
  shapes: any[] = new Array<any>();
  i : number = 0;
  bounds: LatLngBounds;
  circleArea: any; // Reference al cerchio disegnato sulla mappa come oggetto Google Maps API

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
      clickable: true,
      fillColor: feature.getProperty('color'),
      strokeWeight: 1
    });
  }

  onMapReady(map){
    console.log("Map Ready.")
    this.map = map;
    this.drawCircle();
    this.adjustBounds(this.circle);
  }

  drawCircle() {
    ////////////////////////////////////////////////////////
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.circle.latitude, this.circle.longitude),
      map: this.map,
      
    });
    this.circleArea = new google.maps.Circle({
      // strokeColor: '#FF0000',
      // strokeOpacity: 0.8,
      // strokeWeight: 2,
      // fillColor: '#FF0000',
      // fillOpacity: 0.35,
      strokeWeight: 1,
      map: this.map,
      center: new google.maps.LatLng(this.circle.latitude, this.circle.longitude),
      radius: this.circle.radius
    });
  }

  adjustBounds(circle){
    this.circle = circle
    let bounds = this.circleArea.getBounds();
    console.log("adjustBounds() called")
    console.log(this.circle)
    // for (const area of this.aree)
    // {
    //   for (const mm of area.geomArea.geometry.coordinates[0])
    //   {
    //     this.bounds.extend(new google.maps.LatLng(mm[1], mm[0]));
    //   }
    // }
    this.map.fitBounds(bounds);
  }

}
