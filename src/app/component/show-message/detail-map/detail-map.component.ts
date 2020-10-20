import { Component, OnInit, Input } from '@angular/core';
import { LatLngLiteral, LatLngBounds } from '@agm/core';
import { Coordinate } from 'src/app/model/areaCoords';
import { Area } from 'src/app/model/area';
import { MessageService } from 'src/app/injectable/message.service';
declare const google: any;

@Component({
  selector: 'app-detail-map',
  templateUrl: './detail-map.component.html',
  styleUrls: ['./detail-map.component.css']
})
export class DetailMapComponent implements OnInit {

  @Input('senderId') senderId: number;
  @Input('aree') aree : Area [] = new Array<Area>();
  coords : Coordinate[];
  coordinate : string[] = new Array<string>();
  center: LatLngLiteral;
  paths: LatLngLiteral[] = new Array<LatLngLiteral>();
  shapes: any[] = new Array<any>();
  i : number = 0;
  bounds: LatLngBounds ;

  constructor(public messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getAreaList(this.senderId).subscribe((areasResp: Area[]) => {
      console.log(this.aree)
      console.log(areasResp)
      for (let area of this.aree){
        console.log("ENTRATO-1")
        for(let cont = 0; cont < areasResp.length; cont ++){
          console.log("ENTRATO-2")
          if (areasResp[cont].id == area.id){   
            console.log("ENTRATO-3") 
            for (let area of this.aree){
              console.log("ENTRATO-4")
              //console.log(areasResp[cont].geomArea.coordinates[0])
              this.coords = new Array<Coordinate>();
              // this.coords = areasResp[cont].polygon;
              //this.coords = areasResp[cont].geomArea.coordinates[0];
              this.generatePolygon();
              console.log("ENTRATO-5")
              console.log(this.coords)
              this.shapes.push(this.paths);
            }
          }
        }
      };
    });
  }

  onMapReady(map){
    this.bounds = new google.maps.LatLngBounds();
    for (const mm of this.paths)
    {
      this.bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
    }
    map.fitBounds(this.bounds);
  }

  generatePolygon(){
    let i = 0;
    console.log("ENTRATO-XXX")
    //console.log(this.coords)
    for (let coord of this.coords){
      let path = {lat : 0, lng : 0};
      // path.lat = coord.x;
      // path.lng = coord.y;
      path.lat = coord[0];
      path.lng = coord[1];
      this.paths.push(path);
      i++;
    }
    console.log("ENTRATO-6")
    console.log(this.center)
    console.log(this.paths)
    this.center = {
      lat: this.paths[0].lat - ((this.paths[0].lat - this.paths[(Math.floor(this.paths.length/3))].lat) * 2),
      lng: this.paths[0].lng - ((this.paths[0].lng - this.paths[(Math.floor(this.paths.length/3))].lng) / 1.5)
    }

    console.log("ENTRATO-7")
    console.log(this.center)
  }

}
