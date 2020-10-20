import { Url } from 'url';

export class CapCategory {
  label  : string;
  value : string;
  idsender: number;
}

export class CapEvent {
  label: string;
  value: string;
  event: string;
}

export class CommonJsonProperty {
  label : string;
  value : string;
}

export class CapMessage {
  identifier : string;
  sender: string;
  sent: Date;
  status: string;
  msgType: string;
  scope : string;
  source: string;
  code: string[];
  infoList: InfoList[];
}

export class InfoList {
  language: string;
  category: string[];
  event: string;
  headline: string;
  description: string;
  responseType?: string[];
  senderName: string;
  urgency: string;
  severity: string;
  certainty: string;
  instruction: string;
  onset?: Date;
  effective?: Date;
  expires: Date;
  area: MessageArea[];
  resource: MessageResource[];
}

export class MessageArea {
  idArea: string;
}

export class MessageResource {
  resourceDesc : string;
  mimeType: string;
  uri: string;
}


