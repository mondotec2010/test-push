import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-extend-message-dialog',
  templateUrl: './extend-message-dialog.component.html',
  styleUrls: ['./extend-message-dialog.component.scss']
})
export class ExtendMessageDialogComponent implements OnInit {
  scadenza_attuale: Date;

  scadenzaForm = new FormGroup({
    scadenza_data : new FormControl(new Date()),
    scadenza_tempo : new FormControl('23:59')
  });

  constructor(private dialogRef: MatDialogRef<ExtendMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      // console.log("in constructing scadenza: ");
      // console.log(data.scadenza);
      this.scadenza_attuale = data.scadenza;
    }

  ngOnInit(): void {
    this.scadenzaForm.setValidators(this.dateValidator()) // setta il validator per i tempi
    // this.scadenzaForm.get('scadenza_data').setValidators(this.dateValidator()) // setta il validator per i tempi
    // this.scadenzaForm.get('scadenza_tempo').setValidators(this.dateValidator()) // setta il validator per i tempi
    this.scadenzaForm.get('scadenza_data').setValue(this.scadenza_attuale);
  }

  onSubmit() {
    console.log("submitting")
  }

  closeExtending() {
    // console.log("Consolo logging output: ")
    // console.log(this.scadenza.value)
    // console.log(this.scadenza_tempo.value)
    let scadenza: Date = new Date(this.scadenzaForm.value.scadenza_data);
    // console.log("invalid date?");
    // console.log(control.value);
    const endTimePart = this.scadenzaForm.value.scadenza_tempo.split(':');
    scadenza.setHours(Number(endTimePart[0]), Number(endTimePart[1]));
    console.log("closeExtending");
    console.log(scadenza);
    this.dialogRef.close({
      message: 'prorogate',
      newEndDate: scadenza
    });
  }

  closeCancelling() {
    console.log("closeCancelling");
    this.dialogRef.close({
      message: 'cancel'
    })
  }

  dateValidator(): ValidatorFn {
    // console.log('validating');
    return (control: AbstractControl): { [key: string]: any } | null => {
      let scadenza: Date = new Date(control.value.scadenza_data);
      // console.log("invalid date?");
      // console.log(control.value);
      const endTimePart = control.value.scadenza_tempo.split(':');
      scadenza.setHours(Number(endTimePart[0]), Number(endTimePart[1]));
      // console.log("scadenza: ")
      // console.log(scadenza)
      // console.log("scadenza_attuale: ")
      // console.log(this.scadenza_attuale)
      ///////////////////////////
      // console.log('INIZIO TOUCHED')
      if (scadenza.getTime() - new Date(this.scadenza_attuale).getTime() < -1) { // almeno un quarto d'ora
      // console.log('throwing endDate error')
        return {
          'endDate': true
        };
      }
      return null;
    }

  }

}
