import { Injectable } from '@angular/core';
import { Area } from 'src/app/model/area';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  coords: Array<string> = new Array<string>();
  newArea:string;
  newPolygon: Array<number> = new Array<number>();

  constructor() { }
}
