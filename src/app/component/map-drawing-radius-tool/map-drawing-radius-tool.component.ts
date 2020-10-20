import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LatLngLiteral, CircleManager } from '@agm/core';
import { NewArea } from 'src/app/model/areaCoords';
import { Circle } from './model/circle';

declare var google: any;

@Component({
  selector: 'app-map-drawing-radius-tool',
  templateUrl: './map-drawing-radius-tool.component.html',
  styleUrls: ['./map-drawing-radius-tool.component.css']
})
export class MapDrawingRadiusToolComponent implements OnInit {
  @Output() circleUpdated = new EventEmitter();
  radiusInsertion : boolean = true;
  markerInserted : boolean = false;
  marker : any; // Il marker centro dell'cerchio come oggetto google maps
  map: any; // La mappa come oggetto google maps
  radiusKm: number;
  circleArea: any;
  serverMessage : any;
  coordinate : string[] = new Array<string>();
  newAreaControll : boolean = false;
  paths: LatLngLiteral[] = new Array<LatLngLiteral>();
  center: LatLngLiteral;
  areaName: string;
  polygonShape: string;
  polygon: string;
  polygonReady: boolean = false;
  path = [{lat: 0, lng: 0}];
  lat : string = "";
  lng : string = "";
  i : number = 0;
  cont = 0;
  newArea: NewArea = new NewArea();
  //center

  constructor() { }

  ngOnInit() {

  }

  onMapReady(map){
    this.map = map;
    map.setCenter(new google.maps.LatLng(41.730697, 12.278506))  // Da modificare
    this.initDrawingManager(map)
  }

  initDrawingManager(map)
  {
    try {
      this.newArea.polygonArray = Array<number>();
      var drawingManager = new google.maps.drawing.DrawingManager(
      {
        drawingMode: google.maps.drawing.OverlayType.null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['marker']
        },
        // circleOptions: {
        //   strokeColor: '#FF0000',
        //   fillColor: '#FF0000',
        //   draggable: false,
        //   editable: true,
        // },
      });        
      google.maps.event.addListener(drawingManager, 'markercomplete', (marker) => {
        //var radius = circle.getRadius();
        //console.log('Circle radius: ');
        //marker.setMap(null);
        if(this.markerInserted) {
          marker.setMap(null);
          console.log("marker già inserito")
        } else {
          this.marker = marker;
          this.markerInserted = true;
          console.log("New marker position: ")
          console.log(this.marker.position);
        }
        //this.polygonShape = "";
        //this.polygon = "";
        //let firsPoint;
        //firsPoint = polygon.getPath().getAt(0).lat();
        //let secondPoint;
        //secondPoint = polygon.getPath().getAt(0).lng();
        // for (let cont = 0; cont < polygon.getPath().getLength(); cont ++){
        //   this.newArea.polygonArray.push( polygon.getPath().getAt(cont).lat());
        //   this.newArea.polygonArray.push( polygon.getPath().getAt(cont).lng());
        // }
        //this.newArea.polygonArray.push(firsPoint);
        //this.newArea.polygonArray.push(secondPoint);
      });
      drawingManager.setMap(map);
      //this.polygonReady = true;
    } catch (error) {
      console.log('> Error is handled: ', error.name);
    }
  }

  onRadiusInserted() {
    console.log("radius changed. Properties: ")
    console.log(this.map)
    console.log(this.marker.position)
    console.log(this.radiusKm)
    /////////////// Cancella il cerchio precedente//////////
    if(this.circleArea) {
      this.circleArea.setMap(null)
    }
    ////////////////////////////////////////////////////////
    this.circleArea = new google.maps.Circle({
      // strokeColor: '#FF0000',
      // strokeOpacity: 0.8,
      // strokeWeight: 2,
      // fillColor: '#FF0000',
      // fillOpacity: 0.35,
      strokeWeight: 1,
      map: this.map,
      center: this.marker.position,
      radius: this.radiusKm * 1000 // Moltiplicazione per ottenere i kilometri
    });
    this.circleUpdated.emit( // Emette un cerchio
      { latitude: this.marker.position.lat(),
        longitude: this.marker.position.lng(),
        radius: this.radiusKm * 1000 }
    )
  }

}
