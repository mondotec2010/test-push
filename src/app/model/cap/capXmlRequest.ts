import { OriginalMessages } from '../originalMessages';
import { AreaCap } from './areaCap';
export class CapXmlRequest {
  messages: OriginalMessages[];
  areas: AreaCap[];
  idsender: number;
  startDate: Date;
  endDate: Date;
}
