import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableCongesEnAttenteDataSource, TableCongesEnAttenteItem } from './table-conges-en-attente-datasource';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Conge} from "../../../Modeles/conge";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NavComponent} from "../../../nav/nav.component";
import {CongesHttpService} from "../../../configuration-http/conges-http.service";
import {TableCongesDataSource} from "../../visualisation-conges/table-conges/table-conges-datasource";
import {dateFormatter} from "../../../../environments/environment";

@Component({
  selector: 'app-table-conges-en-attente',
  templateUrl: './table-conges-en-attente.component.html',
  styleUrls: ['./table-conges-en-attente.component.scss']
})
export class TableCongesEnAttenteComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableCongesEnAttenteItem>;
  dataSource: TableCongesEnAttenteDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nomUtilisateur' , 'prenomUtilisateur', 'dateDebut' , 'dateFin' , 'type' , 'etat' , 'commentaire' ,'actions'];
  closeResult = '';
  commentaire ='';
  idConges = '';
  data: Conge[] = [];
  httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(public nav: NavComponent ,private changeDetectorRefs: ChangeDetectorRef, private modalService: NgbModal, private httpClient: HttpClient, private httpConges: CongesHttpService) {
    this.dataSource = new TableCongesEnAttenteDataSource(httpClient);
  }

  ngAfterViewInit(): void {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    })
    this.recuperationConge('EN_COURS');
  }

  open(content: any, id: string , commentaire: string) {
  this.commentaire ='';
  this.idConges = id;
  this.commentaire = commentaire;
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

  recuperationConge(etat: string) {
    this.data = [];
    if (this.dataSource) {
      let res = this.httpConges.getConges();
      res.subscribe(
        resultat => {
          for(var i=0; i<resultat.listConges.length; i++){
            if(resultat.listConges[i].etat == etat){
              this.data.push(resultat.listConges[i]);
            }
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
