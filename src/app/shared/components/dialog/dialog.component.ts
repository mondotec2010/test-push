import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  dialogMessage: string;
  dateMessage: string;
  messButton: boolean = false;
  passButton: boolean = false;
  backToNumberListButton: boolean = false;
  senderButton: boolean = false;
  okButton: boolean = false;
  emptyListButton: boolean = false;
  sessionButton: boolean = false;
  saveMapButton : boolean = false;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.data.message == "" || this.data.message == undefined) {
      console.log(this.data.message)
      this.sessionButton = true;
    }
    if ((this.data.message === "endDateAllert") || (this.data.message === "startDateAllert")) {
      this.dateMessage = this.data.message;
    } else {
      switch (this.data.message) {
        case "MES01": case "MES02": {
          this.messButton = true;
          break;
        }
        case "ERR06": case "ERR16": {
          this.emptyListButton = true;
          break;
        }
        case "ERR10": case "ERR24": case "CD02": case "CD03": case "MES04": case "ERR25": case "ERR26": case "ERR27": case "ERR28": case "ERR29":{
          this.okButton = true;
          break;
        }
        case "LOG01": case "PAS01": case "PAS02": case "PAS03": {
          this.passButton = true;
          break;
        }
        case "CD01": {
          this.okButton = true;
          this.backToNumberListButton = true;
          break;
        }
        case "ERR14": case "MES03": {
          this.emptyListButton = true;
          break;
        }
        case "ok": {
          this.saveMapButton = true;
          break;
        }
      }
      this.dialogMessage = this.data.message;
    }
  }

  close() {
    this.dialogRef.close();
  }

  onClick(): void {
    location.reload(false);
    this.dialogRef.close();
  }
  
  return() {
    this.router.navigate([''])
  }

}