import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  resetRouteBlock: boolean = false;
  loginRoute: boolean = false;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) { }

  resetPassword(email: string): Observable<any> {
    let body = `email=${email}`;
    return this.http.put<any>(`${environment.baseUrl}/v4/op/users/pwd/reset`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  changePasssword(password: string): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/v4/uop/users/pwd/change`, {
      'password': password
    });
  }

  // user(): Observable<any> {
  //   return this.http.get<any>(`${environment.baseUrl}/users/user`)
  // }
  user(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/v4/uop/users/me`)
  }

  // Cambia la lingua dell'utente salvata nel database
  changeLanguage(language: string): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/v4/uop/users/language`, {
      params: { 'lang': language }
    })
  }
}
