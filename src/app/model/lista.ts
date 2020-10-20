import { Coordinate } from './areaCoords';
import { LatLng } from '@agm/core';

export class Lista {
    senderName: string;
    numDev: number;
    distListDTO: {
        id: number,
        idsender: number,
        name: string,
        createdDate: string,
        createdBy: string,
        modifiedDate: string,
        modifiedBy: string
    }
}


