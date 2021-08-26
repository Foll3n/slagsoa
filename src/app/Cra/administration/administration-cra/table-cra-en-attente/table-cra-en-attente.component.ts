import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {CraWeekInsert} from '../../../models/logCra/craWeekInsert';
import {TableCraAdministration} from '../TableCraAdministraton';
import {HttpClient} from '@angular/common/http';
import {CraWeek} from '../../../models/cra/craWeek';
import {Subscription} from 'rxjs';
import {CraWaitingService} from '../../../../services/craWaiting.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MailHttpDatabase} from '../../../../configuration-http/MailHttpDatabase';
import {UserService} from '../../../../services/user.service';


@Component({
  selector: 'app-table-cra-en-attente',
  templateUrl: './table-cra-en-attente.component.html',
  styleUrls: ['./table-cra-en-attente.component.scss']
})

/**
 * Table des cra en attentes ou des cra validés
 */
export class TableCraEnAttenteComponent implements OnInit, AfterViewInit {
  @Input() index!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CraWeekInsert>;
  dataSource: TableCraAdministration;
  listeCraWaiting: CraWeekInsert[] = [];
  listeCraValidate: CraWeekInsert[] = [];
  actualWeek!: CraWeek;
  listeCraSubscription!: Subscription;
  commentaire = '';
  headTableElements = ['dateStart', 'dateEnd', 'Nom', 'Prenom', 'actions'];
  @Output() craWeekEmitter: EventEmitter<CraWeekInsert> = new EventEmitter();

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

  }

  constructor(private userService: UserService, private httpClient: HttpClient, public craWaitingService: CraWaitingService, public dialog: MatDialog) {
    this.dataSource = new TableCraAdministration();
  }

  /**
   * envoie au parent le CRA afin de l'afficher
   * @param cra
   */
  envoieParent(cra: CraWeekInsert) {
    this.craWeekEmitter.emit(cra);
  }

  /**
   * initialisation du cra semaine validé ou non validé
   */
  ngOnInit(): void {
    this.listeCraSubscription = this.craWaitingService.waitingSubject.subscribe(
      (craWeek: CraWeekInsert[]) => {
        this.listeCraWaiting = craWeek;
        this.update();

      });
    this.listeCraSubscription = this.craWaitingService.validateSubject.subscribe(
      (craWeek: CraWeekInsert[]) => {
        this.listeCraValidate = craWeek;
        this.update();
      });
  }

  /**
   * ouvrir le dialogue pour laisser un message de refus au cra
   * @param cra
   */
  openDialog(cra: CraWeekInsert): void {
    const dialogRef = this.dialog.open(DialogContent, {
      width: '550px',
      data: {name: this.commentaire}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.commentaire = result;
      this.refuserCra(cra);
    });

  }

  /**
   * mise à jour du tableau datasource
   */
  update() {

    if (this.index == '1') {
      this.dataSource.setListe(this.listeCraWaiting);
    } else if (this.index == '2') {
      this.dataSource.setListe(this.listeCraValidate);
    }
  }

  /**
   * valider un compte rendu d'activité
   * @param cra
   */
  validerCra(cra: CraWeekInsert) {
    this.craWaitingService.validerCra(cra, 'OK');
  }

  /**
   * refuser un compte rendu d'activité
   * @param cra
   */
  refuserCra(cra: CraWeekInsert) {
    this.craWaitingService.refuserCra(cra, this.commentaire);
    this.paginator!._changePageSize(this.paginator!.pageSize);
    const sendMail = new MailHttpDatabase(this.httpClient);
    const response = sendMail.sendMail('mailCra_rejet', cra.prenomUsername!, false, this.userService.getMail(cra.idUsr)!);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        console.log('mail envoyé');
      } else {
        console.log('mail non envoyé');
      }
    });

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
