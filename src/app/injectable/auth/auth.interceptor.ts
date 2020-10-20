import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of, timer, BehaviorSubject } from 'rxjs';
import { catchError, retry, retryWhen, tap, scan, delayWhen, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { genericRetryStrategy, ShouldRetryFn } from './rxjs-utils';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionInterruptedComponent } from 'src/app/component/connection-interrupted/connection-interrupted.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // connectionInterruptedYet: boolean = false;

    constructor(
        private router: Router,
        private auth: AuthService,
        private matDialog: MatDialog
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.token) { // Ha il token, quindi è loggato (magari sessione scaduta...)
            // Non sovrascrive l'Authorization header se già presente (già popolato da oauth, è una sua request)
            if (!request.headers.get("Authorization")) {
                //request = request.clone({ setHeaders: { Authorization: `Bearer ${this.auth.token.access_token}` } });
                request = this.addToken(request, this.auth.token.access_token);
                // E' una normale richesta, controlla quindi se il token sta scadendo, e refreshalo in caso
                //this.auth.checkAndRefreshToken();
            }
        }

        // const { shouldRetry } = this;
        return next.handle(request).pipe(
            // retryWhen( genericRetryStrategy({ shouldRetry }) ),
            catchError((err: any) => {
                if (err.status === 401 && err.error.error_description == "Access token expired: " + this.auth.token.access_token) {

                    console.log("token expired in interceptor, chiamata handle401Error")
                    return this.handle401Error(request, next);
                }
                if (err.status === 401 && 
                    (err.error.error_description == "Invalid access token: " + this.auth.token.access_token ||
                    err.error.error_description.startsWith("Invalid refresh token (expired):")) ) {
                    // this.connectionInterruptedYet = true;
                    console.log("Access token non valido o refresh token scaduto")
                    let dialog = this.matDialog.open(ConnectionInterruptedComponent);
                    dialog.afterClosed().subscribe(data => {
                        this.router.navigateByUrl('/login');
                        window.location.reload();
                    });

                }
                throw err;
            })
        );
    }
    // private shouldRetry: ShouldRetryFn = (err) => (err.status === 401 && err.error.error_description == "Access token expired: " + this.auth.token.access_token)

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            console.log("refreshing: in handle401Error")
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.auth.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.jwt);
                    return next.handle(this.addToken(request, token.jwt));
                }));

        } else {
            // console.log("refreshing: in handle401Error")
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request = request.clone({ setHeaders: { Authorization: `Bearer ${this.auth.token.access_token}` } });
      }


}