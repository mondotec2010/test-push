import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-generic-error-response',
  templateUrl: './dialog-generic-error-response.component.html',
  styleUrls: ['./dialog-generic-error-response.component.scss']
})
export class DialogGenericErrorResponseComponent implements OnInit {

  dialogMessage: string;
  errorCode:string;

  constructor(public router: Router,
    public dialogRef: MatDialogRef<DialogGenericErrorResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  

  ngOnInit(): void {
 
      this.dialogMessage = this.data.message;
      this.errorCode = this.data.errorCode;
  }

  onClick(): void {
    location.reload(false);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
