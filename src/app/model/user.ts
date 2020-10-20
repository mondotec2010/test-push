import { Sender } from './sender';

export class User {
    id: number;
    //createdDate: Date;
    //lastModifiedDate: Date;
    username: string;
    //password: string; Perchè la password?!
    lang: string; // Lingua di default del portale associata allo User
    passwordReset: boolean = false;
    senders: Sender[]; // Lista dei senders associati allo User
}
