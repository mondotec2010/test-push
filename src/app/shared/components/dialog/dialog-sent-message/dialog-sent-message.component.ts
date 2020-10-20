import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-sent-message',
  templateUrl: './dialog-sent-message.component.html',
  styleUrls: ['./dialog-sent-message.component.css']
})
export class DialogSentMessageComponent implements OnInit {
  dialogMessage: string;
  dateMessage: string;

  constructor(public router: Router,
    public dialogRef: MatDialogRef<DialogSentMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.status == "" || this.data.status == undefined) {
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


