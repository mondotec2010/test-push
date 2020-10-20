import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/injectable/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  visible: boolean;
  password1: string;
  password2: string;
  serverMessage: any = "";
  passwordState: string;
  block: boolean;
  spinner: boolean = false;

  constructor(
    public changeService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.block = true;
    if (this.changeService.loginRoute === true) {
      this.block = false;
    } else {
      this.changeService.resetRouteBlock = true;
    }

  }

  changePassword() {
    this.spinner = true;
    this.serverMessage = new Error;
    if (this.password1 === this.password2) {
      this.changeService.changePasssword(this.password1).subscribe((resp) => {
        this.serverMessage.message = resp.message;
        this.openDialog();
        this.spinner = false;
      })
    } else {
      this.serverMessage.message = "PAS03";
      this.openDialog();
      this.spinner = false;
    }
  }

  back() {
    this.changeService.loginRoute = false;
    this.router.navigate(['']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { message: this.serverMessage.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.password1 === this.password2) {
        this.changeService.resetRouteBlock = false;
        this.changeService.loginRoute = false;
        this.router.navigate(['']);
      }
    });
  }

}
