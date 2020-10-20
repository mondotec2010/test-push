import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-generic-error-message',
  templateUrl: './dialog-generic-error-message.component.html',
  styleUrls: ['./dialog-generic-error-message.component.scss']
})
export class DialogGenericErrorMessageComponent implements OnInit {

  dialogMessage: string;

  constructor(public router: Router,
    public dialogRef: MatDialogRef<DialogGenericErrorMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  

  ngOnInit(): void {
 
      this.dialogMessage = this.data.message;
  }

  onClick(): void {
    location.reload(false);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }



}
