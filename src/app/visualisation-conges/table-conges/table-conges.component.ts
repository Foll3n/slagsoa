import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortable} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {TableCongesDataSource, TableCongesItem} from './table-conges-datasource';
import {MatDialog} from "@angular/material/dialog";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Conge} from "../../Modeles/conge";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-table-conges',
  templateUrl: './table-conges.component.html',
  styleUrls: ['./table-conges.component.scss']
})
export class TableCongesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableCongesItem>;
  dataSource: TableCongesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['dateDebut', 'dateFin', 'type', 'etat', 'commentaire', 'actions'];
  closeResult = '';
  data!: Conge[];
  httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(private changeDetectorRefs: ChangeDetectorRef, private modalService: NgbModal, private httpClient: HttpClient,) {
    this.dataSource = new TableCongesDataSource(httpClient);
  }

  ngAfterViewInit(): void {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
    this.recuperationConge();
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      // @ts-ignore
      //this.table.dataSource.data.splice(0, 1);
      if(this.data){
        // @ts-ignore
        this.table.dataSource.data = this.data;
      }
      this.dataSource.connect();
    },200);









  }

  //---------------------------------------------MODAL---------------------------------------
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

//---------------------------------------------MODAL---------------------------------------
  envoi() {
    let a = new Conge();
    a.dateDebut = '2040-04-10';
    a.dateFin = '2050-04-10';
    a.commentaire= 'RTT';
    a.etat= 'CONFIRME';
    a.type= 'RTT';
    a.idUtilisateur = '12';

    this.httpClient.post(environment.urlConges, a, this.httpOptions).subscribe(
      reponse => {
        console.log(reponse);
        this.recuperationConge();
        // @ts-ignore
        this.data.push(a);
        this.ngAfterViewInit();
      },
      error => {
        console.log(error);
      }
    )
    //location.reload();
  }

  recuperationConge(){
    let res = this.dataSource.getConges();
    res.subscribe(
      resultat => {
        let a!: Conge[];
        // @ts-ignore
        this.data = resultat.listConges;
      },
      error => {
        console.log(error);
      }
    )
  }

}
