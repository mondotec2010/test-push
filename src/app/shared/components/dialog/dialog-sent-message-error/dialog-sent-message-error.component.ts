
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-sent-message-error',
  templateUrl: './dialog-sent-message-error.component.html',
  styleUrls: ['./dialog-sent-message-error.component.scss']
})
export class DialogSentMessageErrorComponent implements OnInit {
  dialogMessage: string;

  constructor(public router: Router,
    public dialogRef: MatDialogRef<DialogSentMessageErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      if (this.data.errorCode == "" || this.data.errorCode == undefined) {
        console.log(this.data.status)
       
      }
    else {
                  
        }
        this.dialogMessage = this.data.message;
      }

      close() {
        this.dialogRef.close();
      }
    
      onClick(): void {
        location.reload(false);
        this.close();
      }
  
      newMessageRouting()
      {
        this.router.navigate(['/newMessage']);
      }
  
      onReturn(){
        this.return();
        this.close();
      }
  
      onNewMessage()
      {
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
          this.newMessageRouting();
          });
          this.close();
      }
      
      return() {
        this.router.navigate([''])
      }
  
      justRefresh()
      {
        this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true });
      }
  
      confirmError(){
        this.return();
        this.close();
      }
}
