import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { MessageService } from 'src/app/injectable/message.service';
import { Sender } from 'src/app/model/sender';
import { Area } from 'src/app/model/area';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UploadResult } from 'src/app/model/uploadResult';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileInput, FileValidator } from 'ngx-material-file-input';
import { Lista } from 'src/app/model/lista';
import { DetailMapV2Component } from '../detail-map-v2/detail-map-v2.component';
import SampleJson from 'src/assets/italert-portal-cap-mapping.json';
import { CapCategory, CapEvent, CommonJsonProperty, CapMessage, InfoList, MessageArea, MessageResource } from 'src/app/model/cap/jsonMapper';
import { MatStepper } from '@angular/material/stepper';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { ResponseFileUpload } from 'src/app/model/ResponseFileUpload';
import { MatRadioButton } from '@angular/material/radio';
import { NewMessageHelperComponent } from './newMessageHelperComponent';
import { DialogResponseFileUploadComponent } from 'src/app/shared/components/dialog/dialog-response-file-upload/dialog-response-file-upload.component';
import { DialogGenericErrorMessageComponent } from 'src/app/shared/components/dialog/dialog-generic-error-message/dialog-generic-error-message.component';
import { DialogGenericErrorResponseComponent } from 'src/app/shared/components/dialog/dialog-generic-error-response/dialog-generic-error-response.component';
import { DialogSentMessageComponent } from 'src/app/shared/components/dialog/dialog-sent-message/dialog-sent-message.component';
import { ResponseMessageSent } from 'src/app/model/responseMessageSent';
import { LiteralsMessageDialog } from 'src/app/model/literalsMessageDialog';
import { DialogSentMessageErrorComponent } from 'src/app/shared/components/dialog/dialog-sent-message-error/dialog-sent-message-error.component';
import { MatButton } from '@angular/material/button';
import { FileCapacity } from 'src/app/model/fileCapacity';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {

  public selectedMoment = new Date();

  @Output() messageSendSuccess: EventEmitter<any> = new EventEmitter();
  @ViewChild(DetailMapV2Component) agmMap: DetailMapV2Component;
  senders: Sender[];
  selectedSender: Sender;
  dataSource;
  expandedElement: any;
  categories: any;
  categorySelected: any;
  language: any;
  languages: any;
  logo: any;
  aree: Area[] = [];
  areeToShow: Area[] = [];
  liste: Lista[] = undefined;
  listeDelSender: Lista[] = undefined;
  inizio: Date;
  scadenza: Date;
  sub: boolean = false;
  chosenSendingMode: string = 'aree';
  fieldStillLoading: number = 0;
  panelOpenState: boolean = false;
  // originalMessages : FormGroup
  //  oggetti per le combo presi dal Json
  messageCategories: CapCategory[] = SampleJson.category;
  messageEvents: CapEvent[] = SampleJson['eventcode-event'];
  messageUrgencies: CommonJsonProperty[] = SampleJson.urgency;
  messageSeverities: CommonJsonProperty[] = SampleJson.severity;
  messageCertainties: CommonJsonProperty[] = SampleJson.certainty;
  messageResponseTypes: CommonJsonProperty[] = SampleJson.responseType;
  messageIntructions: CommonJsonProperty[] = SampleJson.instruction;
  messageLanguages: CommonJsonProperty[] = SampleJson.language;
  messageStatus: CommonJsonProperty[] = SampleJson.status;
  signature: string = SampleJson['sender-signature'];
  msgType : string[]  = SampleJson.msgType;
  sender : string = SampleJson.sender;
  code : string[] = SampleJson.code;
  scope : string[] = SampleJson.scope;
  mimeTypeArray:string[] = SampleJson["mime-type"];
  messageChanel = [
    {id : 0 , value : 'EDXL-IT Hub (rss/atom - api - github)'},
    {id : 1 , value : 'IT-Alert Cellbroadcast'},
    {id : 2 , value : 'IT-Alert App'},
    {id : 3 , value : 'IT-Alert Web'}
  ]
  messagesignature : string[] = new Array<string>();
  @ViewChild('msgStatus',{static:false}) msgStatus: MatRadioButton;
  @ViewChild('forwardButton1',{static:false}) forwardButton1:MatButton;
  @ViewChild('forwardButton2',{static:false}) forwardButton2:MatButton;
  @ViewChild('fileInput',{static:false}) fileInput:FileInput;
  capMessage: CapMessage = new CapMessage();
  /**
   * In this example, it's 100 MB (=100 * 2 ** 20).
   */
  //readonly maxSize = 5242880;
  serverMessage:string;
  firstStepFormGroup = this.fb.group({
    messageCategory: [null, Validators.required],
    messageEvent: [null],
    messageUrgency: [null, Validators.required],
    messageSeverity: [null, Validators.required],
    messageCertainty: [null, Validators.required],
    messageResponse: null,
    messageStatus: [null],
    times: this.fb.group({
      creation: [new Date()],
      creationTime: [new Date().getHours() + ':' + new Date().getMinutes()],
      sent: [new Date(), Validators.required],
      sentTime: [new Date().getHours() + ':' + new Date().getMinutes(), Validators.required],
      effective : null,
      effectiveTime: null ,
      onset : null,
      onsetTime: null,
      expires: [new Date(), Validators.required],
      expiresTime: ['23:59']
    })
  })

  secondStepFormGroup = this.fb.group({
    instruction:[''],
    originalMessages: this.fb.group({
      eventIT: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
      subjectIT: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
      bodyIT: ['', Validators.compose([Validators.maxLength(200), Validators.required])],

      eventGB: ['', Validators.compose([Validators.maxLength(100)])],
      subjectGB: ['', Validators.compose([Validators.maxLength(100)])],
      bodyGB: ['', Validators.compose([Validators.maxLength(600)])],

      eventDE: ['', Validators.compose([Validators.maxLength(100)])],
      subjectDE: ['', Validators.compose([Validators.maxLength(100)])],
      bodyDE: ['', Validators.compose([Validators.maxLength(600)])],

      eventFR: ['', Validators.compose([Validators.maxLength(100)])],
      subjectFR: ['', Validators.compose([Validators.maxLength(100)])],
      bodyFR: ['', Validators.compose([Validators.maxLength(600)])],

      eventES: ['', Validators.compose([Validators.maxLength(100)])],
      subjectES: ['', Validators.compose([Validators.maxLength(100)])],
      bodyES: ['', Validators.compose([Validators.maxLength(600)])],
    }),
  })

  thirdStepFormGroup = this.fb.group({
    area: [[], Validators.required],
  })

  fourthStepFormGroup = this.fb.group({
    file: [undefined]
    //file: [undefined, FileValidator.maxContentSize(this.maxSize)]
  })

  fifthStepFormGroup = this.fb.group({
    senderSignature : [this.signature, Validators.required],
    publicationChanel : [null, Validators.required]
  })

  jobForm = this.fb.group({
    sender: ['', Validators.required],
    category: ['', Validators.required],
    link: ['', Validators.compose([Validators.maxLength(2000),
    Validators.pattern("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")])],
    sendingMode: 'aree',
    aree: [[], Validators.required],
    lista: null,
  });

  newResource:MessageResource = new MessageResource();
  helper:NewMessageHelperComponent = new NewMessageHelperComponent();
  currentDate:Date = new Date();

  constructor(
    private messageService: MessageService,
    public dialog: MatDialog,
    public router: Router,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    //public map: MapComponent,
    //public dlService: DistributionListService
  ) { }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.expandedElement = undefined;
  }
  onClickSearchbar() {
    this.expandedElement = undefined;
  }
  ngOnInit() {
    //this.messageResponseTypes.splice(0,1);
    this.messagesignature.push(this.signature);
    this.increaseFieldStillLoading();
    /*var dateN:Date=new Date();
    dateN.setHours(23);
    dateN.setMinutes(59);*/
    this.jobForm.get('sendingMode').valueChanges
      .subscribe(sendingMode => {
        if (sendingMode === 'aree') {
          this.jobForm.get('aree').setValidators([Validators.required]);
          this.jobForm.get('lista').setValidators(null);
        }
        if (sendingMode === 'lista') {
          this.jobForm.get('aree').setValidators(null);
          this.jobForm.get('lista').setValidators([Validators.required]);
        }
        this.jobForm.get('aree').updateValueAndValidity();
        this.jobForm.get('lista').updateValueAndValidity();
      });
    this.jobForm.get('aree').valueChanges
      .subscribe(areeToShow => {
        if (areeToShow && this.aree) this.areeToShow = this.aree.filter(s => areeToShow.includes(s.id));
        if (this.areeToShow.length === 0) this.panelOpenState = false;
        if (this.panelOpenState) this.agmMap.adjustBounds(this.areeToShow);
      });

      this.firstStepFormGroup.get('messageCategory').valueChanges.subscribe( category => {
        console.log("CATEGORY CHANGED");
        console.log(category)
        this.categorySelected = category;
      });
      this.buildCapacity();
  }
responseMessageSent:ResponseMessageSent = new ResponseMessageSent();
literalsDialog:LiteralsMessageDialog = new LiteralsMessageDialog();
  sendMessage() {
    this.messageMapper();
    this.messageService.sendCapMessage(this.capMessage).subscribe((resp) => {
      if(resp){
      this.responseMessageSent = resp;
      this.openDialogSuccess(this.responseMessageSent.message,this.responseMessageSent.status,this.responseMessageSent.capFileName);
      console.log(resp);
      }
      //else{this.openErrorResponse("Errore il server risponde con un oggetto null");}
    },(err) => {
      
      this.openDialogError(this.literalsDialog.responseMessageError,err.errocCode)
    });
  }

  compareFunction(value0: string, value1: string) {
    return (value0 === value1);
   }

   languageHelperFun(){
   }

  messageMapper(){
    this.capMessage.identifier = '';
    this.capMessage.sender = this.sender;
    this.capMessage.sent = this.setDate(this.firstStepFormGroup.get('times').get('sent').value , this.firstStepFormGroup.get('times').get('sentTime').value);
    if(this.firstStepFormGroup.get('messageStatus').value){
    this.capMessage.status = this.firstStepFormGroup.get('messageStatus').value.value;
    }else{ this.capMessage.status = 'Actual'}
    this.capMessage.msgType = this.msgType[0];
    this.capMessage.source = this.sender;
    this.capMessage.scope = this.scope[0];
    this.capMessage.code = this.code;
    this.capMessage.infoList = new Array<InfoList>();
    this.capMessage.infoList.push(this.infolistMapper(this.secondStepFormGroup.get('originalMessages').get('eventIT').value,
      this.secondStepFormGroup.get('originalMessages').get('subjectIT').value,
      this.secondStepFormGroup.get('originalMessages').get('bodyIT').value,
      this.messageLanguages[0].value));
    if( (this.secondStepFormGroup.get('originalMessages').get('eventGB').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('subjectGB').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('bodyGB').value!="")){
          this.capMessage.infoList.push(this.infolistMapper(this.secondStepFormGroup.get('originalMessages').get('eventGB').value,
          this.secondStepFormGroup.get('originalMessages').get('subjectGB').value,
          this.secondStepFormGroup.get('originalMessages').get('bodyGB').value,
          this.messageLanguages[1].value));}
        if( (this.secondStepFormGroup.get('originalMessages').get('eventFR').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('subjectFR').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('bodyFR').value!="")){
          this.capMessage.infoList.push(this.infolistMapper(this.secondStepFormGroup.get('originalMessages').get('eventFR').value,
          this.secondStepFormGroup.get('originalMessages').get('subjectFR').value,
          this.secondStepFormGroup.get('originalMessages').get('bodyFR').value,
          this.messageLanguages[2].value));}
        if( (this.secondStepFormGroup.get('originalMessages').get('eventES').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('subjectES').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('bodyES').value!="")){
            this.capMessage.infoList.push(this.infolistMapper(this.secondStepFormGroup.get('originalMessages').get('eventES').value,
            this.secondStepFormGroup.get('originalMessages').get('subjectES').value,
            this.secondStepFormGroup.get('originalMessages').get('bodyES').value,
            this.messageLanguages[3].value));}
        if( (this.secondStepFormGroup.get('originalMessages').get('eventDE').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('subjectDE').value!="")&&
        (this.secondStepFormGroup.get('originalMessages').get('bodyDE').value!="")){
              this.capMessage.infoList.push(this.infolistMapper(this.secondStepFormGroup.get('originalMessages').get('eventDE').value,
              this.secondStepFormGroup.get('originalMessages').get('subjectDE').value,
              this.secondStepFormGroup.get('originalMessages').get('bodyDE').value,
              this.messageLanguages[4].value)); }
      console.log('evento');
    console.log(this.capMessage);
  }

  infolistMapper(event:string, subject:string, body:string , language:string){
    const infoList = new InfoList();
    infoList.language = language;
    infoList.event = event;
    infoList.headline = subject;
    infoList.description = body;
    infoList.category = new Array<string>();
    //infoList.instruction
    if(this.firstStepFormGroup.get('messageCategory').value.value!=""){
    infoList.category.push(this.firstStepFormGroup.get('messageCategory').value.value);}
    else{   infoList.category.push("");    }
    infoList.responseType = new Array<string>();
    if(this.firstStepFormGroup.get('messageResponse').value){
      infoList.responseType.push(this.firstStepFormGroup.get('messageResponse').value.value);
    }else{    infoList.responseType.push("");   }
    infoList.senderName = 'italertusr';
    infoList.urgency = this.firstStepFormGroup.get('messageUrgency').value.value;
    infoList.severity = this.firstStepFormGroup.get('messageSeverity').value.value;
    infoList.certainty = this.firstStepFormGroup.get('messageCertainty').value.value;
    infoList.instruction = "";
    if(this.secondStepFormGroup.get('instruction').value)
    {   infoList.instruction = this.secondStepFormGroup.get('instruction').value.value;   }
    else{   infoList.instruction = "";   }
    infoList.onset = (this.firstStepFormGroup.get('times').get('onset').value && this.firstStepFormGroup.get('times').get('onsetTime').value) ? this.setDate(
      this.firstStepFormGroup.get('times').get('onset').value,
      this.firstStepFormGroup.get('times').get('onsetTime').value) : null;
    infoList.effective = (this.firstStepFormGroup.get('times').get('effective').value && this.firstStepFormGroup.get('times').get('effectiveTime').value)? this.setDate(
      this.firstStepFormGroup.get('times').get('effective').value,
      this.firstStepFormGroup.get('times').get('effectiveTime').value ) : null;
    infoList.expires = this.firstStepFormGroup.get('times').get('expires').value  ? this.setDate(
      this.firstStepFormGroup.get('times').get('expires').value,
      this.firstStepFormGroup.get('times').get('expiresTime').value):null;//: null;
    infoList.area = this.thirdStepFormGroup.get('area').value;
    infoList.resource = [];
    if(   (this.newResource.mimeType!="") &&
      (this.newResource.uri!=null)){
        infoList.resource.push(this.newResource);
      }
      console.log(this.newResource);
    console.log('INFOLIST')
    console.log(infoList);

    return infoList;
  }

  setDate(inputDate?, inputTime?){
      const date = inputDate;
      date.setHours(inputTime.toString().slice(0, 2));
      date.setMinutes(inputTime.toString().slice(3));
      return date;
  }

  goToStepTwo(stepper: MatStepper){
    stepper.next();
  }

  getFlagClass() {
    let flagClass = this.selectedSender ? 'flag-icon-' + this.selectedSender.lang.toLocaleLowerCase() : null;
    if (flagClass) return ['flag-icon', flagClass];
    return ['flag-icon'];
  }

  areeSelected() {
    // console.log("aree selected")
  }

  listeSelected() {
    // console.log("liste selected")
  }

  increaseFieldStillLoading() {
    this.fieldStillLoading = this.fieldStillLoading + 1;
  }

  decreaseFieldStillLoading() {
    this.fieldStillLoading = this.fieldStillLoading - 1;
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

  back() {
    this.router.navigate([''], { relativeTo: this.route });
  }

  closeDialog() {
    // this.dialogRef.close();
  }

  categorySort(categories) {
    categories.sort((a, b) => a.category.localeCompare(b.category));
  }

  senderSort(senders) {
    senders.sort((a, b) => a.name.localeCompare(b.name));
  }

  areeSort(aree) {
    aree.sort((a, b) => a.area.localeCompare(b.area));
  }

  listeSort(liste) {
    console.log(liste);
    liste.sort((a, b) => a.name.localeCompare(b.name));
  }

  changeSendingMode(value) {
    this.areeToShow = [];
    this.jobForm.patchValue({
      aree: this.areeToShow.map((item) => item.id)
    });
    this.chosenSendingMode = value;
    // console.log("sending mode: ");
    // console.log(this.chosenSendingMode);
  }

  setAreeAndListaErrorToNull() {
    // this.jobForm.get('aree').setErrors({'emptyTarget': null})
    // this.jobForm.get('lista').setErrors({'emptyTarget': null})
    // this.markFormGroupTouched(this.jobForm);
  }

  requiredTargetValidator(target: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log("in validator...");
      console.log(control.value);
      console.log("Checking: ");
      console.log(this.chosenSendingMode);
      console.log(target);
      if (this.chosenSendingMode == target) {
        if ((control.value) == null || control.value.length == 0) {
          return {
            'emptyTarget': true
          };
        }
      }
      else {
        return null;
      }
    }
  }

  areaChecked(event, area) {
    console.log('CHECKED:');
    console.log(event);
    console.log(area);
    console.log('areeToShow:');
    console.log(this.areeToShow);
    if (event.checked) {
      this.areeToShow.push(area);
    } else {
      this.areeToShow = this.areeToShow.filter(item => item !== area);
    }
    console.log("AREEEE ID:");
    console.log(this.areeToShow.map((item) => item.id));
    this.jobForm.patchValue({
      aree: this.areeToShow.map((item) => item.id)
    });
    this.agmMap.adjustBounds(this.areeToShow);
  }

  redFlag:boolean=false;
  redFlagSent:boolean=false;
  redFlagTimeSent:boolean=false;
  redFlagExp:boolean=false;
  redFlagTimeExp:boolean=false;
  /*================================================================================================
  *=====# Algorithms checks before forwarding by comparisons on date and time (sent and end) #======
  *================================================================================================*/
  
 public timeExtractor(nameTime:string):number[]{
	var arrayResponse:number[] = new Array<number>();
	var time:string = this.firstStepFormGroup.get('times').get(nameTime+'Time').value;
	var splitted = time.split(':');
	var hour = splitted[0];
	var minute = splitted[1];
	var hourInt:number = parseInt(hour);
	var minuteInt:number = parseInt(minute);
	arrayResponse.push(hourInt);
	arrayResponse.push(minuteInt);
	return arrayResponse;
  }
  
public dateSentChange(  dateSent:Date ){
  var dateNow:Date = new Date();
  var timeExp:string = this.firstStepFormGroup.get('times').get('expiresTime').value;
  var dateEnd: Date = this.firstStepFormGroup.get('times').get('expires').value;
  var timeSent:string = this.firstStepFormGroup.get('times').get('sentTime').value;
  
  //tempo di invio
  var splitted = timeSent.split(':');
  var hour = splitted[0];
  var minute = splitted[1];
  var hourSentInt:number = parseInt(hour);
  var minuteSentInt:number = parseInt(minute);
  
  //tempo di fine
  var splitted2 = timeExp.split(':');
  var hour2 = splitted2[0];
  var minute2 = splitted2[1];
  var hourExpInt:number = parseInt(hour2);
  var minuteExpInt:number = parseInt(minute2);
  //check if the sent time is in forward to expires
  dateEnd.setHours(hourExpInt);
  dateEnd.setMinutes(minuteExpInt);
  //check if the sent time is in forward to current
  dateSent.setHours(hourSentInt);
  dateSent.setMinutes(minuteSentInt);
  
  if(	(dateSent.getTime() < (this.currentDate.getTime()-60000) ) ||	(dateSent.getTime() > ( dateEnd.getTime()-3600000) ))
  {
    this.redFlagSent=true;
    document.getElementById("sentDate").style.color = "red";
	  this.forwardButton1.disabled=true;
    return;
  }
  else{
	this.redFlagSent=false;
	document.getElementById("sentDate").style.color = "black";
	if(this.firstStepFormGroup.valid&&!this.redFlagTimeSent&&!this.redFlagExp&&!this.redFlagTimeExp){this.forwardButton1.disabled=false;return;}
  }
}//end fun
  
public timeSentChange(time:string) {
  if(time==undefined ||time=="")
    return;
  //==########check on Date#######==
  var dateSent: Date = this.firstStepFormGroup.get('times').get('sent').value;
  var dateEnd: Date = this.firstStepFormGroup.get('times').get('expires').value;
  var expiresTime:number[] = this.timeExtractor('expires');
  var sentTime:number[] = this.timeExtractor('sent');
  dateEnd.setHours(expiresTime[0]);
  dateEnd.setMinutes(expiresTime[1]);
  dateSent.setHours(sentTime[0]);
  dateSent.setMinutes(sentTime[1]);
  if( (dateSent.getTime() < (this.currentDate.getTime()-60000)) || (dateSent.getTime()>(dateEnd.getTime()-3600000)) )
  {
    this.redFlagTimeSent=true;
    //console.log(dateSent.getHours()+' ore sent - current '+(currentDate.getHours()) +' '+dateEnd.getHours());
    console.log(dateSent.getHours()+' ora sent- ora end'+dateEnd.getHours());
    document.getElementById("sentDate").style.color = "red";
    this.forwardButton1.disabled=true;
    return;
  }
  else{ this.redFlagTimeSent = false;
        console.log(dateSent+' sent - current '+dateEnd);
        document.getElementById("sentDate").style.color = "black";
    if(this.firstStepFormGroup.valid&&!this.redFlagTimeSent&&!this.redFlagExp&&!this.redFlagTimeExp){this.forwardButton1.disabled=false;return;}}//end del primo else
  }//end time sent fun

public dateEndChange(endDate:Date)
{
  var dateSent: Date = this.firstStepFormGroup.get('times').get('sent').value;
  var dateEnd: Date = this.firstStepFormGroup.get('times').get('expires').value;
  var expiresTime:number[] = this.timeExtractor('expires');
  var sentTime:number[] = this.timeExtractor('sent');
  dateEnd.setHours(expiresTime[0]);
  dateEnd.setMinutes(expiresTime[1]);
  dateSent.setHours(sentTime[0]);
  dateSent.setMinutes(sentTime[1]);
  if( dateEnd.getTime() < (dateSent.getTime()-60000) )
  {
    this.redFlagExp=true;
    document.getElementById("endDateLabel").style.color = "red";
    this.forwardButton1.disabled=true;
    return;
  }
  else{
    this.redFlagExp=false;
    document.getElementById("endDateLabel").style.color = "black";
    if(this.firstStepFormGroup.valid&&!this.redFlagTimeExp){this.forwardButton1.disabled=false;return;}//end del primo else

  }
}

public timeEndChange(time:string)
{
  var dateSent: Date = this.firstStepFormGroup.get('times').get('sent').value;
  var dateEnd: Date = this.firstStepFormGroup.get('times').get('expires').value;
  var splitted = time.split(':');
  var hour = splitted[0];
  var minute = splitted[1];
  var hourEndInt:number = parseInt(hour);
  var minuteEndInt:number = parseInt(minute);
  dateEnd.setHours(hourEndInt);
  dateEnd.setMinutes(minuteEndInt);
  var sentTime:number[] = this.timeExtractor('sent');
  dateSent.setHours(sentTime[0]);
  dateSent.setMinutes(sentTime[1]);
  if( dateEnd.getTime() < (dateSent.getTime()-60000) )
  {
    this.redFlagTimeExp=true;
    document.getElementById("endDateLabel").style.color = "red";
    this.forwardButton1.disabled=true;
    return;
  }
  else{
    this.redFlagTimeExp=false;
    document.getElementById("endDateLabel").style.color = "black";
    if(this.firstStepFormGroup.valid&&!this.redFlagTimeSent&&!this.redFlagExp&&!this.redFlagSent)
        {   this.forwardButton1.disabled=false;return;   }//end if
  }//end del else
}
//New function that returns the id of the current sender(MessageCategory)     
getIdOfCurrentSender():number{
  var varCategory:any = this.firstStepFormGroup.get('messageCategory').value;
  var labelFinded:string = varCategory.label;
  var idSender:number;
    for(  let entryCategory of this.messageCategories )
      {
      if(   entryCategory.label == labelFinded    )
        {
              idSender = entryCategory.idsender;
        }
      }
      return idSender;
     }
    
    responseFileUpload:ResponseFileUpload=new ResponseFileUpload(); 
    fileCapacity:Map<string,number> = new Map<string,number>();
    
    buildCapacity()
    {
      this.fileCapacity.set("image",5242880);
      this.fileCapacity.set("audio",15728640);
      this.fileCapacity.set("application",15728640);
      this.fileCapacity.set("video",52428800);
    }
    setFileToUpload()
    {
        if(this.fourthStepFormGroup.get('file').value==null)
         {  console.log('il valore è null');return;  }
        
         var flagSend:boolean=true;
         var varFile:FileInput;
         varFile = this.fourthStepFormGroup.get('file').value;
         var currentFile:File = varFile.files[0];
         var idSender = this.getIdOfCurrentSender();
         var arrayString:string[] = this.mimeTypeArray;
         if(  !(arrayString.includes(currentFile.type)) )
         {
          flagSend=false;
          //this.serverMessage = "Il formato: "+currentFile.type+" non è supportato";
          console.log(this.serverMessage);
          this.openDialogMimeTypeError("Il formato: "+currentFile.type+" non è supportato");
          return;
         }
         var mimeTypeCheck:string[] = currentFile.type.split('/');
         console.log('capacity del file: '+this.fileCapacity.get(mimeTypeCheck[0]));
         var capacity:number = this.fileCapacity.get(mimeTypeCheck[0]);
         if(currentFile.size > capacity)
         {
           flagSend=false;
          this.openDialogMimeTypeError("La size: "+(currentFile.size/1000000)+"MB supera la capacity massima di "+(capacity/1000000)+"MB");
          return;
         }
         if(flagSend&&varFile.files.length){
         this.messageService.uploadMultimediaFile(   this.fourthStepFormGroup.get('file').value, idSender  ).subscribe((resp) => {
           if(resp){
            this.responseFileUpload = resp;
            this.newResource.mimeType=this.responseFileUpload.fileType;
            this.newResource.resourceDesc=currentFile.name;
            this.newResource.uri=this.responseFileUpload.fileRef;
            this.serverMessage = "messaggio: "+this.responseFileUpload.message+", status: "+this.responseFileUpload.status+", fileRef:"+this.responseFileUpload.fileRef;
           console.log(this.serverMessage);
            this.openDialogResponseFileUpload();
           }//end if
          },(err) => {
            this.openErrorResponse("Errore nel upload del File, "+currentFile.name,"codice errore: "+err.error.errorCode);
          });
        }
       }

      checkOnLanguage(nameLanguage:string){
        console.log('stampa string language: event'+nameLanguage);
        if( this.secondStepFormGroup.get('originalMessages').get('event'+nameLanguage).value!="")
        {
          var flagField:boolean[] = new Array<boolean>();
          flagField[0] = false;
          flagField[1] = false;
          document.getElementById("subject"+nameLanguage+"Label").style.color="red";
          document.getElementById("body"+nameLanguage+"Label").style.color="red";
          this.forwardButton2.disabled=true;
          if( this.secondStepFormGroup.get('originalMessages').get('subject'+nameLanguage).value!=""){
            document.getElementById("subject"+nameLanguage+"Label").style.color="black";
            flagField[0] = true;
            flagField[1] = true;
          } 
          if(flagField[0],flagField[1]){
            document.getElementById("body"+nameLanguage+"Label").style.color="black";
            this.forwardButton2.disabled=false;
          }
        }
       }

      openDialogSuccess(msg:string,statusMsg:string,nameCapFile:string): void {
        const dialogRef = this.dialog.open(DialogSentMessageComponent, {
          width: '500px', height:'270px',
          data: { message: msg, 
            status:statusMsg, 
            capFile:nameCapFile  }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log("result: ")
          console.log(result)
        });
      }
    
      openDialogError(msg:string,errorC:string): void {
        const dialogRef = this.dialog.open(DialogSentMessageErrorComponent, {
          width: '500px', height:'270px',
          data: { message: msg, 
            errorCode:errorC  }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log("result: ")
          console.log(result)
        });
      }

      openErrorResponse(msg:string,code:string): void {
        const dialogRef = this.dialog.open(DialogGenericErrorResponseComponent, {
        width: '500px',
        data: { message: msg,
        errorCode:code}
      });
      dialogRef.afterClosed().subscribe(result => {
      //this.router.navigate(['']);
      });
    }

    openDialogResponseFileUpload():void
   {
    const dialogRef = this.dialog.open(DialogResponseFileUploadComponent, {
      width: '500px', height:'300px',
      data: { message: this.responseFileUpload.message, 
        status:this.responseFileUpload.status, 
        fileRef:this.responseFileUpload.fileRef  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result: ")
      console.log(result)
    });
   }

   openDialogMimeTypeError(msg:string):void{
    const dialogRef = this.dialog.open(DialogGenericErrorMessageComponent, {
      width: '500px', height:'170px',
      data: { message: msg  }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result: ")
      console.log(result)
    });
   }

   /*deleteFile(){
     if(this.fourthStepFormGroup.get('file').value)
     {
        this.fileInput.files.pop(); 
     }
   }*/

}//end class

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    ////// Setta i tempi //////
    let inizio: Date = new Date(control.value.inizio);
    let scadenza: Date = new Date(control.value.scadenza);
    const startTimePart = control.value.inizio_tempo.split(':');
    inizio.setHours(Number(startTimePart[0]), Number(startTimePart[1]));
    const endTimePart = control.value.scadenza_tempo.split(':');
    scadenza.setHours(Number(endTimePart[0]), Number(endTimePart[1]));
    ///////////////////////////
    if (inizio.getTime() - new Date().getTime() < -600000) { // almeno -10 minuti
      return {
        'invalidStartDate': true
      };
    }
    // console.log('SCADENZA TOUCHED')
    if (scadenza.getTime() - inizio.getTime() < 3600000) { // almeno un'ora
      return {
        'invalidEndDate': true
      };
    }
    return null;
  }
}