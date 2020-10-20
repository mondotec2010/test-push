import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MessageService } from 'src/app/injectable/message.service';
import { Message } from 'src/app/model/message';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { fromEvent, from, Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort'
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/table';
import { MAR } from '@angular/material/core';
import { Category } from 'src/app/model/category';
import { NewMessageComponent } from './new-message/new-message.component';
import { MatPaginatorIntlCro } from './customPaginatorIntl';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessMessageSendingComponent } from '../success-message-sending/success-message-sending.component';
import { FailedMessageSendingComponent } from '../failed-message-sending/failed-message-sending.component';
import { TerminateResultDialogComponent } from '../terminate-result-dialog/terminate-result-dialog.component';
import { TerminateMessageDialogComponent } from '../terminate-message-dialog/terminate-message-dialog.component';
import { SuccessTerminatingSnackComponent } from 'src/app/success-terminating-snack/success-terminating-snack.component';
import { FailTerminatingSnackComponent } from 'src/app/fail-terminating-snack/fail-terminating-snack.component';
import { ExtendMessageDialogComponent } from '../extend-message-dialog/extend-message-dialog.component';
import { OriginalMessages } from 'src/app/model/originalMessages';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ opacity: 0, height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ opacity: 1, height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ShowMessageComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('terminateButton') private terminateButton: ElementRef;
  message: Message;
  messages: Message[];
  originalMessage: OriginalMessages;
  originalMessages: OriginalMessages[];


  // displayedColumns = ['validity', 'senderName', 'area', 'subject', 'expirationDate', 'messageStatusId', 'messagesRead', 'messagesSent', 'Dettagli', 'Termina'];
  displayedColumns = ['validity', 'senderName', 'subject', 'startDate', 'expirationDate'];
  dataSource;
  areas: string;
  validity: number = 1;
  data: Date;
  progress: boolean = true;
  serverMessage: any = "";
  messageStatus: number;
  expandedElement: any;
  user: string;
  durationInSecondsOfSnackbar: number = 5;
  mapDisplayed = true;
  mapToLoadIndex: number;
  sub: boolean = false;
  emptyList: boolean = false;
  loading: boolean = false;
  matSelectDefaultLanguage: string = 'IT'; //zozzata da sistemare

  constructor(
    public messageService: MessageService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = sessionStorage.getItem('User');
    this.refresh();
    this.data = new Date();
    this.paginator._intl = new MatPaginatorIntlCro();

    // const obs = fromEvent(this.filter.nativeElement, 'keyup')
    // .pipe (
    //   map((e:any) => e.target.value),
    //     debounceTime(150), //only search after 250 ms
    //     distinctUntilChanged()
    //     )

  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data, filter: string) => {
      if (data.detailRow) {
        return ('' + data.element.subject + '.' + data.element.senderName).toLocaleLowerCase().includes(filter)
      }
      return ('' + data.subject + '.' + data.senderName).toLocaleLowerCase().includes(filter)
    };
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'expirationDate': {
          return parseISOString(item.endDate);
        }
        case 'startDate': {
          return parseISOString(item.startDate);
        }
        case 'senderName': {
          return item.senderName.toLowerCase();
        }
        case 'subject': {
          return item.subject.toLowerCase();
        }
        default: {
          return item[property];
        }
      }
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.expandedElement = undefined;
  }
  onClickSearchbar() {
    this.expandedElement = undefined;
  }

  refresh() {
    this.progress = false;
    this.messages = null;
    this.dataSource = new MatTableDataSource<Message>();
    this.dataSource.sort = this.sort;
    console.log("sortinniining?:")
    console.log(this.sort);
    this.dataSource.paginator = this.paginator;
    // console.log('LOGGS: ');
    // console.log(this.sort);
    // console.log(this.paginator);
    this.loading = true;
    this.messageService.getMessageList().subscribe((resp: Message[]) => {
      // resp.forEach((message) => {
      //   if(message.multimediaLink != "") {
      //     console.log("messaggio con multimedia: " + message.multimediaLink)
      //   }
      // })
      console.log(resp)
      ////////////////////////////////////
      ///////////////////////////////////


      if (!resp) {
        return;
      } else { // Popola la lista di messaggi
        this.messages = resp;

        this.messages.forEach(item => {
          item.subject = item.originalMessages.find(x => x.language == item.senderLang).subject;
          item.body = item.originalMessages.find(x => x.language == item.senderLang).content;

          //item.selectedLanguage = item.senderLang;


          /*  if (!(item.originalMessages.find(x => x.language == "ES"))) {
             console.log('TROVATO');
             console.log(item);
           } */

        })


        if (resp.length > 0) {
          this.emptyList = false;
          // Popola il campo categoryName in ogni message //
          for (let i = 0; i < this.messages.length; i++) {
            this.messageService.getCategory(this.messages[i].senderId, this.messages[i].categoryId).subscribe((resp: Category) => {
              this.messages[i].categoryName = resp.category;
            });
          }
          //////////////////////////////////////////////////
          for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].messageStatusId === 5) {
              this.validity = 4;
            } else {
              if (new Date(this.messages[i].startDate).getTime() < this.data.getTime()) {
                if (new Date(this.messages[i].endDate).getTime() < this.data.getTime()) {
                  this.validity = 3;
                } else {
                  this.validity = 2;
                }
              } else {
                this.validity = 1;
              }
            }
            this.messages[i].validity = this.validity;
            let areaString;
            if (!this.messages[i].messagesRead) {
              this.messages[i].messagesRead = 0;
            }
            if (!this.messages[i].messagesSent) {
              this.messages[i].messagesSent = 0;
            }
            if (this.messages[i].area != null) {
              for (let ar of this.messages[i].area) {
                if (areaString == undefined) {
                  areaString = ar.area;
                } else {
                  areaString += ", " + ar.area;
                }
              }
              // <-- Check sul messageTypeId  DA DECIDERE
              // Per Aree
              if (this.messages[i].messageTypeId == '1') {
                this.messages[i].area[0].area = areaString;
              }
              // Per Raggio
              if (this.messages[i].messageTypeId == '4') {

              }
              // Per Lista di Distribuzione
              if (this.messages[i].messageTypeId == '7') {

              }
              // --> Check sul messageTypeId
            } else {
              this.messages[i].area = [{ area: '—', id: 0, geomArea: null, centroidLat: 0, centroidLon: 0 }];
            }
          }
          this.progress = true;
        } else {
          this.emptyList = true
        }
      }
      const rows = [];
      this.messages.forEach(element => rows.push(element, {
        detailRow: true, element,
        endDate: element.endDate,
        startDate: element.startDate,
        senderName: element.senderName,
        subject: element.subject
      }));
      console.log(rows);
      this.dataSource.data = rows;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      // console.log(err);
      // console.log("errrororororooro")
      // this.progress = true;
      // this.serverMessage = err.error;
      // this.router.navigate(['/login'], { relativeTo: this.route });
      // this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { message: this.serverMessage.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result: ")
      console.log(result)
    });
  }

  openTerminateMessageDialog(id: number) {
    const dialogRef = this.dialog.open(TerminateMessageDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(choice => {
      console.log("cdk eliminating?!");
      // console.log(this.terminateButton['_elementRef'].nativeElement
      // .classList);
      // this.terminateButton['_elementRef'].nativeElement
      //   .classList.remove('cdk-program-focused');
      if (choice == 'terminate') {
        //terminate message
        this.sub = true;
        this.messageService.terminateMessage(id.toString()).subscribe(response => {
          this.sub = false;
          this.serverMessage = response;
          for (let i = 0; i < this.dataSource.data.length / 2; i++) {
            if (this.messages[i].id == id) {
              this.dataSource.data[i].messageStatusId = 5;
              this.dataSource.data[i].validity = 4;
            }
          }
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/messages']);
          });
          // open successSnack
          this._snackBar.openFromComponent(SuccessTerminatingSnackComponent, {
            duration: this.durationInSecondsOfSnackbar * 1000,
          });
        }, (err) => {
          this.sub = false;
          this.serverMessage = new Error;
          this.serverMessage.message = err.error.message;
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/messages']);
          });
          // open failedSnack
          this._snackBar.openFromComponent(FailTerminatingSnackComponent, {
            duration: this.durationInSecondsOfSnackbar * 1000,
          });
        })
      }
      if (choice == 'cancel') {
        //do nothing
      }
    });
  }

  openExtendMessageDialog(message: Message) {
    // console.log('expiration date: ')
    // console.log(message.endDate)
    const dialogRef = this.dialog.open(ExtendMessageDialogComponent, {
      width: '400px',
      data: {
        id: message.id,
        scadenza: message.endDate
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message == 'prorogate') {
        //terminate message
        console.log("result new endDate: ");
        let newEndDate: Date = new Date(result.newEndDate);
        console.log(newEndDate.toUTCString());
        this.messageService.prorogateMessage(message.id.toString(), newEndDate.toISOString()).subscribe(response => {
          console.log('EXTENDING MESSAGE')
          this.serverMessage = response;
          // for (let i = 0; i < this.dataSource.data.length/2; i++) {
          //   if (this.messages[i].id == message.id) {
          //     this.dataSource.data[i].messageStatusId = 5;
          //     this.dataSource.data[i].validity = 4;
          //   }
          // }
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/messages']);
          });
          // open successSnack
          this._snackBar.openFromComponent(SuccessTerminatingSnackComponent, {
            duration: this.durationInSecondsOfSnackbar * 1000,
          });
        }, (err) => {
          console.log('EXTENDING MESSAGE ERROR')
          // this.serverMessage = new Error;
          // this.serverMessage.message = err.error.message;
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/messages']);
          });
          // open failedSnack
          this._snackBar.openFromComponent(FailTerminatingSnackComponent, {
            duration: this.durationInSecondsOfSnackbar * 1000,
          });
        })
      }
      else {
        //do nothing
        console.log('NOTHING');
      }
    });
  }

  newMessageDialog(): void {
    this.router.navigate(['/newMessage'], { relativeTo: this.route });
    // console.log("loooooooog")
    // const dialogRef = this.dialog.open(NewMessageComponent, {
    //   panelClass: 'custom-dialog-container',
    //   width: '1100px',
    //   height: '80vh',F
    //   data: { message: this.serverMessage.message },
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result == 'MES01') {
    //     this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
    //       this.router.navigate(['/messages']);
    //     });
    //     this.openSuccessSnackBar();
    //   } else if (result == 'ERR') {
    //     this.openFailedSnackBar();
    //   } else if (result === undefined) {
    //     // console.log('result: ');
    //     // console.log(result);
    //   }
    // });
  }



  // presentationDialog(): void {
  //   const dialogRef = this.dialog.open(NewMessageDialogComponent, {
  //     panelClass: 'custom-dialog-container',
  //     width: '1100px',
  //     height: '80vh',
  //     disableClose: true
  //   });
  // }



  openSuccessSnackBar() {
    this._snackBar.openFromComponent(SuccessMessageSendingComponent, {
      duration: this.durationInSecondsOfSnackbar * 1000,
    });
  }

  openFailedSnackBar() {
    this._snackBar.openFromComponent(FailedMessageSendingComponent, {
      duration: this.durationInSecondsOfSnackbar * 1000,
    });
  }

  getRecord(row) {
    console.log("Row clicked: ");
    console.log(row);
  }

  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  test() {
    console.log('test');
  }

  cellClicked(element) {
    console.log(element.name + ' cell clicked');
  }

  closeRow() {
    //console.log('test click: ');
    this.expandedElement = undefined;
    //console.log(row);
  }

  scroll(index: number) {
    console.log('index: ');
    console.log(index);
    var elmnt = document.getElementById("main-container");
    setTimeout(() => {
      // elmnt.scrollTop = 300;
      elmnt.scroll({
        top: (50 * (index / 2)) + 20,
        left: 0,
        behavior: 'smooth'
      });
    }, 200);
  }

  setMapToLoadIndex(index: number) {
    this.mapToLoadIndex = index + 1;
  }

  toggleMap() {
    //this.mapDisplayed = !this.mapDisplayed;
  }

  mostraAllegato(ref: String) {
    console.log("mostra allegato con ref: ");
    console.log(ref);
  }

  terminateMessage(id: number) {
    this.openTerminateMessageDialog(id);
  }

  extendMessage(message: Message) {
    this.openExtendMessageDialog(message);
  }

  onLanguageMenuItem(item, message) {
    console.log("ONITEMMENUFUNZIONA!")
    console.log(item)
    console.log(message)
    message.subject = item.subject
    message.body = item.content
  }

}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

