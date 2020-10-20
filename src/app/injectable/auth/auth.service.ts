import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token } from '../../model/token';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
    private _token: Token;
    // iat : number; // data di emissione
    exp : number; // data di scadenza
    toleranceBeforeExpiration : number = 900000; // 15 minuti i millisecondi
    refreshingToken: boolean = false;

    constructor(private http: HttpClient) { }

    post(user: string, pass: string) {
        return this.http.post<Token>(`${environment.baseUrl}/oauth/token`, null, {
            headers: { 'Authorization': `Basic ${btoa('extapi-client:extapi-v1-secret')}` },
            params: { 'username': user, 'password': pass, 'grant_type': 'password' }
        }).pipe(tap((token: Token) => { 
            this.token = token; 
            // aggiorna iat e exp
            // this.updateExp();
            console.log("not refreshed token: ");
            console.log(token)
            // console.log("trying refreshing token");

            // this.refreshToken().subscribe();
        }));
    }

    // Refresha il token
    refreshToken() {
        return this.http.post<Token>(`${environment.baseUrl}/oauth/token`, null, {
            headers: { 'Authorization': `Basic ${btoa('extapi-client:extapi-v1-secret')}` },
            params: { 'access_token': this.token.access_token, 'refresh_token': this.token.refresh_token, 'grant_type': 'refresh_token' }
            // params: { 'refresh_token': this.token.refresh_token, 'grant_type': 'refresh_token' }
        }).pipe(tap((token: Token) => { 
            this.token = token; 
            // aggiorna iat e exp
            // this.updateExp();
            console.log("refreshed token: ");
            console.log(token); 
        }));
    }

    // Controlla se il token sta scadendo, e lo refresha in caso
    checkAndRefreshToken() {
        this.http.post<Token>(`${environment.baseUrl}/oauth/check_token`, null, {
            headers: { 'Authorization': `Basic ${btoa('extapi-client:extapi-v1-secret')}` },
            params: { 'token': this.token.access_token }
        }).pipe(tap((token_info: any) => { 
            //this.token = token; 
            // aggiorna iat e exp
            // this.updateExp();

            // console.log("token_info: ");
            // console.log(token_info);

            console.log("tempo rimanente prima della scadenza: ");
            let lasso = (token_info.exp*1000 - new Date().getTime()) / 1000;
            console.log(lasso);
            if(lasso<3000 && !this.refreshingToken) {
                console.log("refreshing???")
                this.refreshingToken = true;
                this.refreshToken().subscribe( () => { this.refreshingToken=false } );
            }
        })).subscribe();
    }

    // Controlla se il token sta scadendo, e lo refresha in caso
    checkToken() {
        this.http.post<Token>(`${environment.baseUrl}/oauth/check_token`, null, {
            headers: { 'Authorization': `Basic ${btoa('extapi-client:extapi-v1-secret')}` },
            params: { 'token': this.token.access_token }
        }).pipe(tap((token_info: any) => { 
            //this.token = token; 
            // aggiorna iat e exp
            // this.updateExp();

            // console.log("token_info: ");
            // console.log(token_info);

            console.log("tempo rimanente prima della scadenza: ");
            let lasso = (token_info.exp*1000 - new Date().getTime()) / 1000;
            console.log(lasso);
        })).subscribe();
    }

    // controlla se il token si sta avvicinando alla scadenza
    // isTokenExpiring() : boolean {
    //     let d = new Date();
    //     let n = d.getMilliseconds();
    //     if(this.exp - n < this.toleranceBeforeExpiration) {
    //         return true;
    //     }
    //     return false;
    // }

    // controlla se il token si sta avvicinando alla scadenza
    updateExp() {
        console.log("in updateExp()");
        this.http.post<any>(`${environment.baseUrl}/oauth/check_token`, null, {
            headers: { 'Authorization': `Basic ${btoa('extapi-client:extapi-v1-secret')}` },
            params: { 'token': this.token.access_token }
        }).subscribe( tokenInfo => { 
            console.log(tokenInfo);
            this.exp = tokenInfo.exp * 1000 ; 
            // aggiorna iat e exp
            console.log("tokenInfo.exp * 1000: ")
            console.log(tokenInfo.exp * 1000); 
        });
    }

    set token(token: Token) {
        if (token)
            sessionStorage.setItem('Token', JSON.stringify(token))
        else
            sessionStorage.removeItem('Token');
        this._token = token;
    }

    get token(): Token {
        if (!this._token)
            this._token = JSON.parse(sessionStorage.getItem('Token'));
        return this._token;
    }
}