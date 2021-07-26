import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortable} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {TableCongesDataSource, TableCongesItem} from './table-conges-datasource';
import {MatDialog} from "@angular/material/dialog";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Conge} from "../../../Modeles/conge";
import {environment} from "../../../../environments/environment";
import {dateFormatter} from "../../../../environments/environment";
import {CongesHttpService} from "../../../configuration-http/conges-http.service";
import {any} from "codelyzer/util/function";
import {NavComponent} from '../../../nav/nav.component';


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
  idConges = '';
  data: Conge[] = [];
  httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(public nav: NavComponent ,private changeDetectorRefs: ChangeDetectorRef, private modalService: NgbModal, private httpClient: HttpClient, private httpConges: CongesHttpService) {
    this.dataSource = new TableCongesDataSource(httpClient);
  }

  ngAfterViewInit(): void {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    })
    this.recuperationConge();
  }

  //---------------------------------------------MODAL---------------------------------------
  open(content: any, id: string) {
    this.idConges = id;
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

  recuperationConge() {
    this.data = [];
    if (this.dataSource) {
      let res = this.httpConges.getConges();
      res.subscribe(
        resultat => {
          if(sessionStorage.getItem('role') == 'MANAGER'){
            for(var i=0; i<resultat.listConges.length; i++){
              if(resultat.listConges[i].idUtilisateur == sessionStorage.getItem('id')){

                this.data.push(resultat.listConges[i]);
              }
            }
          }
          else{
              this.data = resultat.listConges;
          }


          if (this.data) {
            for (let i of this.data) {
              let a = i.dateDebut.split(' ');
              let b = i.dateFin.split(' ');
              if (a[1] == '12:00:00.0') {
                i.dateDebut = dateFormatter(a[0]) + " - Matin";
              }
              if (a[1] == '18:00:00.0') {
                i.dateDebut = dateFormatter(a[0]) + " - Après-midi";
              }
              if (b[1] == '12:00:00.0') {
                i.dateFin = dateFormatter(b[0]) + " - Matin";
              }
              if (b[1] == '18:00:00.0') {
                i.dateFin = dateFormatter(b[0]) + " - Après-midi";
              }

            }
          }
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.table.dataSource = this.dataSource;
          // @ts-ignore
          //this.table.dataSource.data.splice(0, 1);
          if (this.data) {
            // @ts-ignore
            this.table.dataSource.data = [...this.data];
          }
          this.dataSource.connect();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  deleteConges() {
    let res = this.httpConges.deleteConges(this.idConges).subscribe(
      reponse => {
        this.ngAfterViewInit();
        this.nav.getCongesEnAttente();
      },
      error => {
        console.log(error);
      }
    )
  }
}
