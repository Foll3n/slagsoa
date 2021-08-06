import {Component, Input, OnChanges, OnInit, AfterViewInit, ViewChild, Inject} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Utilisateur} from "../../../partage/Modeles/utilisateur";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DateValidator} from "../../../partage/Validators/date.validator";
import { resetForm } from "../../../../environments/environment";

@Component({
  selector: 'app-table-utilisateurs',
  templateUrl: './table-utilisateurs.component.html',
  styleUrls: ['./table-utilisateurs.component.scss']
})
export class TableUtilisateursComponent implements OnChanges {

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'mail', 'grade', 'role', 'dateEntree' , 'actions'];
  dataSource!: MatTableDataSource<Utilisateur>;
  utilisateur!: Utilisateur;
  message = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() utilisateurs!: Utilisateur[];
  @Input() grades!: string[];
  @Input() roles!: string[];
  modificationUtilisateur: FormGroup;

  constructor(private modalService: NgbModal) {
    this.modificationUtilisateur = new FormGroup({
      mail: new FormControl('',[Validators.required, Validators.email]),
      prenom: new FormControl('',Validators.required),
      nom: new FormControl('',Validators.required),
      dateEntree: new FormControl('',[Validators.required,DateValidator.dateVaidator]),
      nbCongesCumules: new FormControl('',Validators.required),
      nbCongesPoses: new FormControl('', Validators.required),
      nbCongesRestant: new FormControl('', Validators.required),
      grade: new FormControl('',Validators.required),
      role: new FormControl('',Validators.required),
      mdp: new FormControl(),
      confirmerMdp: new FormControl(),
    });
  }



  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.utilisateurs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
//------------------------------------------ MODAL DEBUT ------------------------------------------------
  closeResult= ''

  open(content: any, user: Utilisateur) {
    this.modificationUtilisateur.patchValue({
      mail: user.mail,
      prenom: user.prenom,
      nom: user.nom,
      dateEntree: user.dateEntree,
      nbCongesCumules: user.nbCongesCumules,
      nbCongesPoses: user.nbCongesPoses,
      nbCongesRestant: user.nbCongesRestant,
      grade: user.grade,
      role:user.role,
      mdp: "",
      confirmerMdp: "",
      });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    resetForm(this.modificationUtilisateur)
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  //------------------------------------------ MODAL FIN ------------------------------------------------

  //------------------------------------------ TABLEAU DEBUT ------------------------------------------------


  modifierUtilisateur() {

  }

  resetMessage() {
    this.message = '';
  }
}
