import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/injectable/user.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { AuthService } from 'src/app/injectable/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    email: string;
    serverMessage: any = "";
    password: string;
    response: string;
    routeBlock: boolean = false;
    spinner: boolean = false;


    constructor(
        public passwordService: UserService,
        public authService: AuthService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
    }

    reset() {
        this.spinner = true;
        this.serverMessage = new Error;
        this.passwordService.resetPassword(this.email).subscribe((resp) => {
            console.log("Resp")
            console.log(resp)
            this.response = resp;
            this.serverMessage.message = resp.message;
            this.spinner = false;
            this.openDialog();

        }, (err) => {
            console.log("Err")
            console.log(err)
            this.serverMessage.message = err.error.errorCode; // DA ERRORE
            this.spinner = false;
            this.openDialog();
        })
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '500px',
            data: { message: this.serverMessage.message }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.spinner = false;
        });
    }
}
