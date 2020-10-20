import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral} from '@agm/core';
import { Area } from 'src/app/model/area';
import * as jsts from 'src/scripts/jsts.min.js';
// import * as jsts from 'jsts';
// import * as variable from 'jsts';

declare var google: any;
// require('jsts');

@Component({
  selector: 'app-area-draw',
  templateUrl: './area-draw.component.html',
  styleUrls: ['./area-draw.component.scss']
})
export class AreaDrawComponent implements OnInit {

  constructor() { }
  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;
  map: any; // Reference alla mappa vera e propria
  drawingManager: any;
  geoJsonObject: any;
  paths: LatLngLiteral[] = new Array<LatLngLiteral>();
  shapes: any[] = new Array<any>();
  i : number = 0;
  bounds: LatLngBounds;
  overlays: any[] = [];

  ngAfterViewInit(): void {
    //console.log(this.aree[0].geomArea);
  }

  ngOnInit(): void {
    // console.log('overlays:');
    // console.log(this.overlays);
  }

  clicked(clickEvent: any) {
    console.log(clickEvent);
  }

  styleFunc(feature) {
    return ({
      clickable: false,
      // fillColor: feature.getProperty('color'),
      fillColor: 'rgba(1, 1, 1, 0.486)',
      strokeColor: 'rgba(1, 1, 1, 0.400)',
      strokeWeight: 0.5
    });
  }

  resetDrawing() {
    var lastOverlay = this.overlays.pop();
    if (lastOverlay) lastOverlay.setMap(null);
    this.drawingManager.setDrawingMode('polygon');
  }

  saveDrawing() {
    /// SAVE AREA ///
    console.log("save area.")
  }


  onMapReady(map){
    console.log("Map Ready.")
    this.map = map;
    map.setOptions({draggable: true, fullscreenControl: true});
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        // drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle'],
        drawingModes: ['polygon']
      },
      // markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      // polylineOptions: {
      //   fillColor: '#ffff00',
      //   fillOpacity: 1,
      //   strokeWeight: 1,
      //   clickable: false,
      //   editable: true,
      //   zIndex: 1
      // },
      polygonOptions: {
        fillColor: 'rgba(191, 191, 191, 0.5)',
        fillOpacity: 1,
        strokeWeight: 1,
        clickable: false,
        editable: true,
        draggable: false,
        geodesic: false,
        zIndex: 1
      }
    });
    this.drawingManager = drawingManager;
    this.drawingManager.setMap(map);
    var overlays = this.overlays;
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (evt) => this.onOverlaycomplete(evt))
  }

  onOverlaycomplete(event) {
    // controlla subito se il poligono si autointerseca.
    this.checkSelfIntersects(event.overlay);
    console.log("path:");
    let coordinates = event.overlay.getPath().getArray().map( (item) => {
      return [item.lat(), item.lng()];
    })
    console.log("coordinates:");
    console.log(coordinates);
    this.overlays.push(event.overlay); // store reference to added overlay
    google.maps.event.addListener(event.overlay, 'rightclick', (evt) => this.onOverlayRigthClick(evt,event.overlay))
    google.maps.event.addListener(event.overlay.getPath(), 'insert_at', () => this.checkSelfIntersects(event.overlay));
    google.maps.event.addListener(event.overlay.getPath(), 'remove_at', () => this.checkSelfIntersects(event.overlay));
    google.maps.event.addListener(event.overlay.getPath(), 'set_at', () => this.checkSelfIntersects(event.overlay));
    // console.log("overlays:");
    // console.log(this.overlays);
    this.drawingManager.setDrawingMode(null);
  }

  checkSelfIntersects(overlay) {
    // console.log("Azione vertice.");
    let res = this.findSelfIntersects(overlay.getPath());
    if(res) {
      console.log("intersecting.")
    } else {
      console.log("not intersecting.")
    }
    // console.log("response: ");
    // console.log(res);
  }

  onOverlayRigthClick(event, overlay) {
    // console.log("event: ");
    // console.log(event);
    // Check if click was on a vertex control point
    if (event.vertex == undefined) {
      return;
    }
    // elimina il poligono se ha tre vertici
    if (overlay.getPath().length == 3) {
      this.resetDrawing();
      return;
    }
    overlay.getPath().removeAt(event.vertex);
    // console.log("vertex removed.");
    // console.log("path object length: ");
    // console.log(overlay.getPath().length);
  }

  googleMaps2JTS(boundaries) {
    var coordinates = [];
    for (var i = 0; i < boundaries.getLength(); i++) {
      coordinates.push(new jsts.geom.Coordinate(
        boundaries.getAt(i).lat(), boundaries.getAt(i).lng()));
    }
    coordinates.push(coordinates[0]);
    // console.log(coordinates);
    return coordinates;
  };

  findSelfIntersects(googlePolygonPath) {
    var coordinates = this.googleMaps2JTS(googlePolygonPath);
    var geometryFactory = new jsts.geom.GeometryFactory();
    var shell = geometryFactory.createLinearRing(coordinates);
    var jstsPolygon = geometryFactory.createPolygon(shell);
  
    // if the geometry is aleady a simple linear ring, do not
    // try to find self intersection points.
    var validator = new jsts.operation.IsSimpleOp(jstsPolygon);
    if (validator.isSimpleLinearGeometry(jstsPolygon)) {
      return;
    }
  
    var res = [];
    var graph = new jsts.geomgraph.GeometryGraph(0, jstsPolygon);
    var cat = new jsts.operation.valid.ConsistentAreaTester(graph);
    var r = cat.isNodeConsistentArea();
    if (!r) {
      var pt = cat.getInvalidPoint();
      res.push([pt.x, pt.y]);
    }
    return res;
  };

  // adjustBounds(aree){
  //   this.aree = aree
  //   this.bounds = new google.maps.LatLngBounds();
  //   // console.log("adjustBounds() called")
  //   // console.log(this.aree)
  //   for (const area of this.aree)
  //   {
  //     for (const mm of area.geomArea.geometry.coordinates[0])
  //     {
  //       this.bounds.extend(new google.maps.LatLng(mm[1], mm[0]));
  //     }
  //   }
  //   this.map.fitBounds(this.bounds);
  // }

}
