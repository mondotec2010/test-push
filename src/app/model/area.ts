import { Coordinate } from './areaCoords';
import { LatLng } from '@agm/core';

export class Area {
    //areaCode: string; //Da togliere?!
    area: string;
    //coords: string; TOLTE
    id: number;
    //polygon : Coordinate[]; TOLTE
    geomArea: any; //AGGIUNTO
    centroidLat: number;
    centroidLon: number;
}


