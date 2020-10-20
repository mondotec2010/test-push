export abstract class Job {
  senderId: number; // Aggiunto.
  body: string;
  categoryCode: string;
  subject: string;
  originalMessages: any;
  url: string;
  multimediaFileRef: string; // Riferimento per riottenere il multimedia
  language: string; // aggiunto
  ///////// per IT-Alert /////////////
  severity: string = null;
  ////////////////////////////////////
  endDate: Date;
  startDate: Date;
  // areaDesc ???
}

export class JobZone extends Job {
  multiArea = true;
  //areaCode: string[] = [];
  areaIds: number[] = [];
}

export class JobList extends Job {
  distListId: number;
  //mail: string; //???
}

export class JobPoint extends Job {
  //senderUsername: string;
  latitude: number;
  longitude: number;
  radiusKm: number; // (Aggiunto) Il raggio in kilometri
  //zoneParamCode: string;
}

// export class JobDistributionList extends Job{
//     distributionListId: number;
//     endDate: Date;
//     startDate: Date;
//     mail: string;
// }

