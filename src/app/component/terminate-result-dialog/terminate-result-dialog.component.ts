import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-terminate-result-dialog',
  templateUrl: './terminate-result-dialog.component.html',
  styleUrls: ['./terminate-result-dialog.component.scss']
})
export class TerminateResultDialogComponent implements OnInit {

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
