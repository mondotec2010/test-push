import { Area } from './area';
import { Circle } from '../component/map-drawing-radius-tool/model/circle';
import { OriginalMessages } from './originalMessages';

export class Message {
  body: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  messageStatusId: number;
  messageTypeId: string; // Il tipo di messaggio: Per Area - Per Lista di Distribuzione - Per Raggio
  email: string;
  senderName: string;
  senderId: string; // aggiunto
  senderLang: string; //aggiunto
  categoryId: string;
  categoryName: string;
  createdBy: string;
  createdDate: Date;
  id: number;
  logo: string;
  area: Area[];
  originalMessages: any;
  //// Campi per punto-raggio ////
  longitude: number;
  latitude: number;
  radiusKm: number;
  //// ./Campi per punto-raggio ////
  circle: Circle; // aggiunto
  messagesRead: number;
  messagesSent: number;
  multimediaName: string;
  multimediaLink: string;
  validity: number = 1;
  language: string; // aggiunto
  selectedLanguage: string;
}
