import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ExtrasService } from 'src/app/extras.service';
import { LatLngBounds } from '@agm/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MessageService } from 'src/app/injectable/message.service';
import { Area } from 'src/app/model/area';
import { MatTabGroup } from '@angular/material/tabs';

declare var google: any;


@Component({
  selector: 'app-area-search',
  templateUrl: './area-search.component.html',
  styleUrls: ['./area-search.component.scss']
})
export class AreaSearchComponent implements OnInit, OnChanges {
  showingArea = false;
  query: string;
  featureCollection: any = [];
  map: any; // Reference alla mappa vera e propria
  selectedAreaGeoJson: any;
  bounds: LatLngBounds;
  loading: boolean = false;
  myControl = new FormControl();
  options: Area[] = [];
  filteredOptions: Observable<Area[]>;
  placeholder: string[] = ['Nina', 'Pinta', 'Santa Maria'];
  targetList: any = [];

  @Input() category: any;
  @Output() areeChanged = new EventEmitter<any>();

  areaAutocompleteControl = new FormControl();
  areaFormGroup = this.fb.group({
    area: null,
  });

  matTabs = [1,2]; 
  @ViewChild('tabGroup',{static:false}) tabGroup: MatTabGroup;

  constructor(public extrasService: ExtrasService,
    private messageService: MessageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filteredOptions = this.areaFormGroup.get('area').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.messageService.getAreaList(1).subscribe((result) => {
      // console.log('AREA RESULT');
      // console.log(result);
      this.options = result;
      this.featureCollection = this.options;
    })
    this.query = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.category.currentValue) {
      this.messageService.getAreaList(changes.category.currentValue.idsender).subscribe((result) => {
        console.log('AREA RESULT');
        console.log(result);
        this.options = result.sort((a,b) => a.area > b.area ? 1 : -1);
        this.featureCollection = this.options;
      })
    }
  }

  private _filter(value: string): Area[] {
    const filterValue = value;
    // console.log(("SEARCHIIIIING"));
    console.log(filterValue);
    // console.log(this.options.map((item) =>
    //   item.area
    // ));
    console.log(this.options.filter(option => option.area.toLowerCase().includes(filterValue)));
    return this.options.filter(option => option.area.toLowerCase().includes(filterValue));
  }

  searchArea() {
    console.log("area searched: ");
    console.log(this.query);
    this.loading = true;
    console.log("area founds: ");
    console.log(this.options.filter((option) => option.area.toLowerCase().includes(this.query.toLowerCase())));
    this.featureCollection = this.options.filter((option) => option.area.toLowerCase().includes(this.query.toLowerCase()))
    this.loading = false;

    this.tabGroup.selectedIndex=0;
      this.tabGroup._tabs.toArray()[0].isActive=true;
    // this.extrasService.findAreaService(this.query).subscribe((response) => {
    //   this.loading = false;
    //   this.featureCollection = response.features;
    //   console.log("LA RESPONSEEE");
    //   console.log(response);


    //   ///////////// Filtra la FeatureCollection per Polygon e MultiPolygon ///////////////
    //   // this.featureCollection.features = this.featureCollection.features.filter(feature => (feature.geometry.type == 'Polygon') || (feature.geometry.type == 'MultiPolygon'));
    //   ////////////////////////////
    // }, (err) => {
    //   console.log(err)
    // })
  }

  onItemExplore(feature) {
    console.log("CLICKED: ");
    console.log(feature);
    this.selectedAreaGeoJson = feature.geomArea;
    this.adjustBounds(feature.geomArea.geometry);
    this.showingArea = true;
  }

  onItemAddToTarget(feature) {
    if (this.targetList.find(x => x.id == feature.id) == null) {
      this.targetList.push(feature);
      this.targetList = this.targetList.sort((a,b) => a.area > b.area ? 1 : -1)
      this.areeChanged.emit(this.targetList);
    }
    console.log('Area già aggiunta al target.');
    this.tabGroup.selectedIndex=1;
      this.tabGroup._tabs.toArray()[1].isActive=true;
  }

  onItemRemoveToTarget(feature) {
    console.log(feature);
    this.targetList = this.targetList.filter(item => item.id != feature.id)
    this.areeChanged.emit(this.targetList);
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

  onMapReady(map) {
    // console.log("Map Ready.")
    this.map = map;
    map.setOptions({ draggable: false, fullscreenControl: false, draggableCursor: '' });
  }

  adjustBounds(geometry) {
    this.bounds = new google.maps.LatLngBounds();
    console.log("adjustBounds() called with param: ")
    console.log(geometry)
    if (geometry.type == 'Polygon') {
      // console.log('adjust bound on Polygon. coordinates: ');
      // console.log(geometry.coordinates[0]);
      for (const mm of geometry.coordinates[0]) {
        this.bounds.extend(new google.maps.LatLng(mm[1], mm[0]));
      }
      this.map.fitBounds(this.bounds);
    } else if (geometry.type == 'MultiPolygon') {
      // console.log('adjust bound on MultiPolygon');
      // console.log(geometry.coordinates);
      for (const polygon of geometry.coordinates) {
        for (const mm of polygon[0]) {
          this.bounds.extend(new google.maps.LatLng(mm[1], mm[0]));
        }
      }
      this.map.fitBounds(this.bounds);
    }
  }

  autocompleteDisplayWith(value: any): string {
    return value?.area
  }

}
