import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {CraWeekInsert} from '../../models/logCra/craWeekInsert';
import {TableCraAdministration} from '../TableCraAdministraton';
import {HttpClient} from '@angular/common/http';
import {CraService} from '../../../services/cra.service';
import {CraHttpDatabase} from '../../../configuration-http/CraHttpDatabase';
import {CraWeek} from '../../models/cra/craWeek';
import {InsertCra} from '../../models/cra/InsertCra';
import {CompteRendu} from '../../models/compteRendu/CompteRendu';
import {Cra} from '../../models/cra/Cra';
import {Subscription} from 'rxjs';
import {CraWaitingService} from '../../../services/craWaiting.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {CommandeHttpDatabase} from "../../../configuration-http/CommandeHttpDatabase";


@Component({
  selector: 'app-table-cra-en-attente',
  templateUrl: './table-cra-en-attente.component.html',
  styleUrls: ['./table-cra-en-attente.component.scss']
})

export class TableCraEnAttenteComponent implements OnInit, AfterViewInit {
  @Input() index!: string;
  // @Input() index!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CraWeekInsert>;
  dataSource: TableCraAdministration;
  listeCraWaiting: CraWeekInsert[] = [];
  listeCraValidate: CraWeekInsert[] = [];
  actualWeek!: CraWeek ;
  listeCraSubscription!: Subscription;
  commentaire = '';
  headTableElements = ['dateStart', 'dateEnd', 'Nom', 'Prenom', 'actions'];
  @Output() craWeekEmitter: EventEmitter<CraWeekInsert> = new EventEmitter();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

  }
  constructor(private httpClient: HttpClient, public craWaitingService: CraWaitingService, public dialog: MatDialog) {
    this.dataSource = new TableCraAdministration(this.httpClient);
  }
  envoieParent(cra:CraWeekInsert) {
    console.log("je suis dans le fils",cra);
    this.craWeekEmitter.emit(cra);
  }
  ngOnInit(): void {
      this.listeCraSubscription = this.craWaitingService.waitingSubject.subscribe(
        (craWeek: CraWeekInsert[]) => {this.listeCraWaiting = craWeek; this.update();

        });
      this.listeCraSubscription = this.craWaitingService.validateSubject.subscribe(
        (craWeek: CraWeekInsert[]) => {this.listeCraValidate = craWeek; this.update();
        });
  }

  openDialog(cra: CraWeekInsert): void {
    const dialogRef = this.dialog.open(DialogContent, {
      width: '550px',
      data: {name: this.commentaire}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.commentaire = result;
      console.log('Dialog result:', this.commentaire);
      this.refuserCra(cra);
    });

  }

  update(){
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",this.listeCraWaiting);

    if (this.index == '1') {
      this.dataSource.setListe(this.listeCraWaiting);
    }
    else if (this.index == '2') {
      this.dataSource.setListe(this.listeCraValidate);
 }
  }

  validerCra(cra: CraWeekInsert){
    console.log('iciiiiiiii i i i i ', cra);
    this.craWaitingService.validerCra(cra, 'OK');
  }
  refuserCra(cra: CraWeekInsert){
    this.craWaitingService.refuserCra(cra, this.commentaire);
    this.paginator!._changePageSize(this.paginator!.pageSize);


  }

}

export interface DialogData {
  commentaire: string;
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  // onClickSend(): void {
  //   this.dialogRef.close();
  // }

}
