import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.scss']
})
export class DeleteListComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteListComponent>) { }
  ngOnInit(): void {
  }

  closeDeleting() {
    this.dialogRef.close('delete');
  }

  closeCancelling() {
    this.dialogRef.close('cancel');
  }


}
