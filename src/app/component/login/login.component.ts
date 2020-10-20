import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/injectable/auth/auth.service';
import { Token } from 'src/app/model/token';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { UserService } from 'src/app/injectable/user.service';
import { User } from 'src/app/model/user';
import { TranslateService } from '@ngx-translate/core';
import { Sender } from 'src/app/model/sender';
import { MatDialog } from '@angular/material/dialog';
import { BadCredentialsComponent } from '../bad-credentials/bad-credentials.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  visible: boolean;
  user: string;
  userName: string;
  password: string;
  spinner: boolean = false;
  serverMessage: any = "";

  constructor(
    public authService: AuthService,
    public passwordService: UserService,
    private router: Router,
    public app: AppComponent,
    public dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    console.log("ngoninit called by login component")
    this.authService.token = null;
    this.passwordService.resetRouteBlock = false;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('');
  }

  login() {
    this.spinner = true;
    this.authService.post(this.user, this.password).subscribe((token: Token) => {
      //console.log(token)
      this.passwordService.user().subscribe((user: User) => {
        // console.log(user)
        sessionStorage.setItem('User', this.user);
        sessionStorage.setItem('UserRole', this.user);
        sessionStorage.setItem('userID', user.id.toString());
        sessionStorage.setItem('lang', user.lang.toLowerCase());
        this.translate.setDefaultLang(user.lang.toLowerCase());
        this.app.user = sessionStorage.getItem('User');

        if (user.passwordReset === false) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['change-password']);
        }
      })
    }, () => {
      this.spinner = false;
      this.serverMessage = "LOG01";
      this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BadCredentialsComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
