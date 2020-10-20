
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-response-file-upload',
  templateUrl: './dialog-response-file-upload.component.html',
  styleUrls: ['./dialog-response-file-upload.component.scss']
})
export class DialogResponseFileUploadComponent implements OnInit {
  dialogMessage: string;

  constructor(public router: Router,
    public dialogRef: MatDialogRef<DialogResponseFileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  

  ngOnInit(): void {
    if (this.data.status == "" || this.data.status == undefined) {
      console.log(this.data.status)
     
    }
  else {
                
      }
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
