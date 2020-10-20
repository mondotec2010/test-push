import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terminate-message-dialog',
  templateUrl: './terminate-message-dialog.component.html',
  styleUrls: ['./terminate-message-dialog.component.scss']
})
export class TerminateMessageDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TerminateMessageDialogComponent>) { }

  ngOnInit(): void {
  }

  closeTerminating() {
    this.dialogRef.close('terminate');
  }

  closeCancelling() {
    this.dialogRef.close('cancel');
  }

}
