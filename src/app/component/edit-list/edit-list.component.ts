import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener, Inject } from '@angular/core';
import { MessageService } from 'src/app/injectable/message.service';
import { Sender } from 'src/app/model/sender';
import { Category } from 'src/app/model/category';
import { Area } from 'src/app/model/area';
//import { JobZone, JobDistributionList } from 'src/app/model/job';
import { JobZone, Job, JobPoint } from 'src/app/model/job';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UploadResult } from 'src/app/model/uploadResult';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LatLngLiteral } from '@agm/core';
import { VariableService } from 'src/app/shared/services/variable.service';
import { Coordinate } from 'src/app/model/areaCoords';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileValidator } from 'ngx-material-file-input';
import { map, debounceTime, distinctUntilChanged, switchMap, tap, take, filter } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { DistributionList } from 'src/app/model/distributionList';
import { DistributionListService } from 'src/app/injectable/distribution-list.service';
//import { DistributionList } from 'src/app/model/distributionList';
//import { DistributionListService } from 'src/app/injectable/distribution-list.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {
  // profileForm = this.fb.group({
  //   firstName: ['', Validators.required],
  //   lastName: [''],
  //   address: this.fb.group({
  //     street: [''],
  //     city: [''],
  //     state: [''],
  //     zip: ['']
  //   }),
  // });
  public selectedMoment = new Date();

  @Output() messageSendSuccess: EventEmitter<any> = new EventEmitter();
  senders: Sender[];
  selectedSender: Sender;
  categories: any;
  language: any;
  logo: any;
  aree: Area[] = undefined;
  inizio: Date;
  scadenza: Date;
  sub: boolean = false;
  term$ = new Subject<any>();
  validDeviceCode: boolean = false;
  deviceCodeStatus: string = 'empty';
  devices: Array<string> = [];
  oldDevices: Array<string> = [];
  csv: string = '';
  validating: boolean = false;
  isCodeValid: boolean = false;
  emptyListFlag: boolean = false;
  deviceInsertedYet: boolean = false;

  /**
   * In this example, it's 100 MB (=100 * 2 ** 20).
   */
  readonly maxSize = 5242880;

  listForm = this.fb.group({
    idsender: [{ value: this.data.senderId, disabled: true }, Validators.required],
    name: [this.data.name, Validators.compose([Validators.maxLength(50), Validators.required])],
    devCode: [''],
    devCodes: [null]
  });

  get deviceCodes() {
    return this.listForm.get('devCodeList') as FormArray;
  }

  addAlias() {
    // this.deviceCodes.push(this.fb.control(''));
    if (this.isCodeValid == true && this.validating == false) {
      let newDevCode: string = this.listForm.value.devCode;
      // this.devices.push(this.listForm.value.devCode);
      if (!this.devices.some((item) => item == newDevCode)) {
        this.emptyListFlag = false
        this.listForm.controls['devCodes'].setErrors(null);
        this.devices.push(newDevCode);
        console.log("added device")
      } else {
        this.deviceInsertedYet = true;
      }
    }
  }

  constructor(
    private distService: DistributionListService,
    private messageService: MessageService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public router: Router,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private sharedVariable: VariableService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    //public map: MapComponent,
    //public dlService: DistributionListService
  ) {
    this.term$.pipe(
      filter(term => (term.keyCode >= 48 && term.keyCode <= 57) || 
        term.keyCode >= 65 && term.keyCode <= 90 ||
        term.keyCode == 8),
      tap((term)=>{
      this.deviceInsertedYet = false;
      this.validating = true;
      // if(!(term.keyCode === 13)) {
      //   // this.validatingError = false;
      //   this.validating = true;
      // } else {
      //   console.log('ENTER PRESSED')
      // }
      }),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(term => {
        console.log('term: ');
        console.log(term);
        return of(term);
      })).subscribe((term) => {
        if (!(term.target.value === '')) {
          this.deviceInsertedYet = false;
          this.distService.deviceValidation(term.target.value).subscribe((resp) => {
            console.log("validation response: ")
            console.log(resp)
            this.isCodeValid = true;
            this.validating = false;
          }, err => {
            if (err.status == '404') {
              console.log("Device not found")
              this.isCodeValid = false;
              this.validating = false;
              console.log('validatinError: ')
              this.listForm.controls['devCode'].setErrors({ 'invalidCode': true });
              this.listForm.controls['devCode'].markAsTouched();
            }
          })
        } else {
          this.validating = false;
          this.isCodeValid = false;
        }
      })
    // this.listForm.patchValue({
    //   idsender: this.data.senderId
    // });
  }

  // @HostListener('window:keyup.esc') onKeyUp() {
  //   this.dialogRef.close();
  // }

  ngOnInit() {
    // console.log("actual data: ")
    // console.log((new Date()).getHours() + ':'+ (new Date()).getMinutes())
    this.messageService.getSenderList().subscribe((senders: Sender[]) => {
      this.senders = senders;
      this.selectedSender = senders.find((item) => item.id == this.data.senderId)
    }, (err) => {
      console.log(err)
    });
    this.distService.getDevicesOfList(this.data.listId).subscribe((devices: string[]) => {
      console.log("devices della lista: ")
      console.log(devices)
      devices.forEach(item => {
        this.devices.push(item)
        this.oldDevices.push(item)
      });
    }, (err) => {
      console.log(err)
    });
    // this.listForm.get('devCode').setValidators(deviceCodeValidator())
  }


  onSubmit() {
    this.sub = true;
    this.markFormGroupTouched(this.listForm);
    if (this.listForm.invalid) { this.sub = false }
    if (!this.checkEmptyDevices()) {
      setTimeout(() => {
        if (this.listForm.valid) {
          console.log('form submitted');
          console.log("generating list...");
          this.modifyList();
        } else {
          this.sub = false;
        }
        // TODO: Use EventEmitter with form value
      }, 2000)
    } else {
      this.emptyListFlag = true;
      this.listForm.controls['devCodes'].setErrors({ 'emptyList': true });
      this.sub = false;
    }
  }

  checkEmptyDevices(): boolean {
    if (this.devices.length == 0) return true;
    else return false;
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.updateValueAndValidity();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  modifyList(): void {
    this.distService.modifyDistributionList(this.data.listId, this.listForm.value.name, this.oldDevices, this.devices).pipe(take(this.oldDevices.length + this.devices.length))
      .subscribe((response) => {
        console.log(response);
        this.closeDialog('modified');
        this.sub = false;
      }, (err) => {
        this.closeDialog('error');
        console.log(err);
        this.sub = false;
      });
  }

  back() {
    this.router.navigate([''], { relativeTo: this.route });
  }

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }
  closeDialogNoResult() {
    this.dialogRef.close();
  }

  categorySort(categories) {
    categories.sort((a, b) => a.category.localeCompare(b.category));
  }

  areeSort(aree) {
    aree.sort((a, b) => a.area.localeCompare(b.area));
  }

  // Elimina un device dalla lista di devices
  deleteDevice(device) {
    this.devices = this.devices.filter(e => e !== device);
  }

}

export function deviceCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    ///////////////////////////
    return {
      'invalidCode': true
    };
  }
}
