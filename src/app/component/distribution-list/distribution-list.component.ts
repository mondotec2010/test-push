import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/app/injectable/message.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DistributionList } from 'src/app/model/distributionList';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Category } from 'src/app/model/category';
import { MatPaginator } from '@angular/material/paginator';
import { DistributionListService } from 'src/app/injectable/distribution-list.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { NewListComponent } from '../new-list/new-list.component';
import { MatPaginatorIntlCro } from '../show-message/customPaginatorIntl';
import { MatPaginatorIntlDistList } from './customPaginatorIntl';
import { DeleteListComponent } from '../delete-list/delete-list.component';
import { Lista } from 'src/app/model/lista';
import { EditListComponent } from '../edit-list/edit-list.component';

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  styleUrls: ['./distribution-list.component.scss']
})
export class DistributionListComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['validity', 'subject', 'senderName', 'listUsers', 'createdDate', 'modifiedDate', 'actions'];
  user: string;
  dataSource;
  serverMessage: any = "";
  lists: Lista[];
  emptyList: boolean = false;
  loading: boolean = false;
  sub: boolean = false;

  constructor(
    public distlistService: DistributionListService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem('User');
    this.refresh();
    this.paginator._intl = new MatPaginatorIntlDistList();
  }

  ngAfterViewInit() {
    // this.dataSource.filterPredicate = (data, filter: string) => {
    //   if (data.detailRow) {
    //     return ('' + data.element.subject + '.' + data.element.senderName).toLocaleLowerCase().includes(filter) 
    //   } 
    //   return ('' + data.subject + '.' + data.senderName).toLocaleLowerCase().includes(filter) 
    // };
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'createdDate': {
          return parseISOString(item.distListDTO.createdDate);
        }
        case 'modifiedDate': {
          return parseISOString(item.distListDTO.modifiedDate);
        }
        case 'subject': {
          return item.distListDTO.name;
        }
        case 'senderName': {
          return item.senderName;
        }
        case 'listUsers': {
          return +item.numDev;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  refresh() {
    this.lists = null;
    this.dataSource = new MatTableDataSource<DistributionList>();
    this.dataSource.sort = this.sort;
    console.log("sortinniining?:")
    console.log(this.sort);
    this.dataSource.paginator = this.paginator;
    // console.log(this.paginator);
    this.loading =true;
    this.distlistService.getDistributionLists().subscribe((resp: Lista[]) => {
      // resp.forEach((message) => {
      //   if(message.multimediaLink != "") {
      //     console.log("messaggio con multimedia: " + message.multimediaLink)
      //   }
      // })
      console.log(resp)
      if (!resp) {
        return;
      } else { // Popola la lista di messaggi
        this.lists = resp;
        if (resp.length > 0) {
          this.emptyList = false;
        } else { // Messaggio sbagliato
          this.emptyList = true;
        }
      }
      // this.dataSource.data = resp;
      this.dataSource.data = resp;
      this.loading =false;
    }, (err) => {
      // console.log(err);
      this.loading =false;
      console.log("errrororororooro")
      // this.progress = true;
      // this.serverMessage = err.error;
      // this.router.navigate(['/login'], { relativeTo: this.route });
      // this.openDialog();
    });
  }
 
  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { message: this.serverMessage.message }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result: ");
      console.log(result);
    });
  }

  newListDialog(): void {
    // console.log("loooooooog")
    const dialogRef = this.dialog.open(NewListComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      maxHeight: '80vh',
      data: { message: this.serverMessage.message },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result == 'created') {
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/distribution-list']);
          }); 
          this.openSuccessSnackBar();
        }else if (result == 'error'){
          this.openFailedSnackBar();
        }else if (result === undefined){
          // console.log('result: ');
          // console.log(result);
        }

    });
  }
  openSuccessSnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Lista creata con successo.', null, conf);
  }
  openFailedSnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Si è verificato un errore.', null, conf);
  }
  openFailedDistListDeleteSnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Errore: Non è possibile cancellare una lista con messaggi associati.', null, conf);
  }
  SnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Si è verificato un errore.', null, conf);
  }

  openDeleteListDialog(id: string) {
    // console.log("delete list id: ");
    // console.log(id);
    const dialogRef = this.dialog.open(DeleteListComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(choice => {
      // console.log("cdk eliminating?!");
      // console.log(this.terminateButton['_elementRef'].nativeElement
      // .classList);
      // this.terminateButton['_elementRef'].nativeElement
      //   .classList.remove('cdk-program-focused');
      if(choice =='delete') {
        //terminate message
        this.sub = true;
        console.log("delete list id: ");
        console.log(id);
        this.distlistService.deleteDistributionList(id).subscribe(response => {
          this.sub = false;
          // this.serverMessage = response;
          // for (let i = 0; i < this.dataSource.data.length/2; i++) {
          //   if (this.messages[i].id == id) {
          //     this.dataSource.data[i].messageStatusId = 5;
          //     this.dataSource.data[i].validity = 4;
          //   }
          // }
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/distribution-list']);
          }); 
          // open successSnack
          this.openSuccessDeleteSnackBar();
        }, (err) => {
          console.log("ERRORE: ");
          console.log(err.error);
          this.sub = false;
          this.serverMessage = new Error;
          this.serverMessage.message = err.error.message;
          // refresh lista messaggi
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/distribution-list']);
          }); 
          // open failedSnack
          if(err.error == "Non è possibile cancellare una lista con messaggi associati." ) {
            this.openFailedDistListDeleteSnackBar();
          } else {
            console.log('qua dentro!!!!!1');
            this.openFailedSnackBar();
          }
        })
      }
      if(choice =='cancel') {
        //do nothing
      }
    });
  }
  openSuccessDeleteSnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Lista eliminata con successo.', null, conf);
  }

  openEditListDialog(id: string, senderid: string, name: string) {
    console.log("loooooooog")
    console.log(id)
    const dialogRef = this.dialog.open(EditListComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      maxHeight: '80vh',
      data: { 
        listId: id,
        senderId: senderid,
        name: name
       },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result == 'modified') {
          this.router.navigateByUrl('/refreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/distribution-list']);
          }); 
          this.openSuccessEditSnackBar();
        }else if (result == 'error'){
          this.openFailedSnackBar();
        }else if (result === undefined){
          // console.log('result: ');
          // console.log(result);
        }
    });
  }
  openSuccessEditSnackBar() {
    let conf = new MatSnackBarConfig()
    conf.duration = 5000
    this._snackBar.open('Lista modificata con successo.', null, conf);
  }

}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
