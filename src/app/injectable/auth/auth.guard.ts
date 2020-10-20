import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
// import { MatDialog } from 'src/app/shared/material.module';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private passwordService: UserService
  ) { }

  canActivate(): boolean {
    if (!this.auth.token) {
      this.router.navigate(['login']);
    } else {
      if ((this.passwordService.resetRouteBlock === true) && (this.passwordService.loginRoute === false)) {
        this.router.navigate(['change-password']);
      } else {
        return this.auth.token != null;
      }
    }
  }
}
