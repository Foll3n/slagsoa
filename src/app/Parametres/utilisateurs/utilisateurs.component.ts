import { Component, OnInit } from '@angular/core';
import { ConnexionComponent } from "../../connexion/connexion.component";
import { HttpClient , HttpHeaders } from "@angular/common/http";
import { RoleHttpService } from "../../configuration-http/role-http";
import { GradeHttpService } from "../../configuration-http/grade-http";
import { UtilisateursHttpService } from "../../configuration-http/utilisateurs-http.service";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { DateValidator } from "../../partage/Validators/date.validator";
import {ConnexionService} from "../../connexion/connexion.service";
import {formatDate} from "@angular/common";
import {Utilisateur} from "../../partage/Modeles/utilisateur";
// import { PassValidator } from "../../partage/Validators/passValidator";

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {

  //------------------------------- Attributs ----------------------------

  roles: string[] = [];
  grades: string[] = [];
  utilisateurs!: Utilisateur[];


  //------------------------------- FORMULAIRE ----------------------------

  inscriptionForm!: FormGroup;

  //------------------------------- CONSTRUCTEUR ----------------------------
  message!: string;
  messageErreur!: string;

  constructor(public http: HttpClient, public utilisateurHttpService: UtilisateursHttpService , public con: ConnexionService, public roleHttpService: RoleHttpService, public gradeHttpService: GradeHttpService) {

  }

  //------------------------------- ngOnInit ----------------------------
  ngOnInit(): void {

    //------------------------------- inscriptionForm ----------------------------
    this.inscriptionForm = new FormGroup({
      mail: new FormControl('',[Validators.required, Validators.email]),
      prenom: new FormControl('',Validators.required),
      nom: new FormControl('',Validators.required),
      dateEntree: new FormControl('',[Validators.required,DateValidator.dateVaidator]),
      nbCongesCumules: new FormControl('',Validators.required),
      nbCongesPoses: new FormControl(),
      nbCongesRestant: new FormControl(),
      grade: new FormControl('',Validators.required),
      role: new FormControl('',Validators.required),
      mdp: new FormControl('',Validators.required),
      confirmerMdp: new FormControl('',[Validators.required]),
    }, );
    // }, {validators: PassValidator} );


    if(this.con.isLogged() && this.con.isSuperAdmin()){
      //-------------------------------------- CHARGEMENT DES DONNEES SI CO -----------------------------------
      this.chargerRoles();
      this.chargerGrades();
      this.chargerUtilisateurs();
    }
  }

  get mdp(){
    return this.inscriptionForm.get('mdp');
  }
  get confirmerMdp(){
    return this.inscriptionForm.get('confirmerMdp');
  }


  mdpValide(){
    if(this.mdp && this.confirmerMdp && this.mdp.value && this.confirmerMdp.value){
      return(this.mdp?.value == this.confirmerMdp?.value);
    }
    return false;
  }
//---------------------------------------------------- CHARGEMENT --------------------------------------------------------------------
  chargerGrades(){
    this.grades = [];
    this.gradeHttpService.getGrade().subscribe(
      reponse=> {
        let listeGrades = reponse.outputGrades;
        for(let i of listeGrades){
          this.grades.push(i.nom);
        }
        console.log(this.grades)
      },
      error =>{
        console.log(error);
      }
    )
  }
  chargerUtilisateurs(){
    this.utilisateurHttpService.getUtilisateurs().subscribe(
      reponse=> {
        this.utilisateurs = reponse.getAllutilisateurOutput;
      },
      error =>{
        console.log(error);
      }
    )
  }
  chargerRoles() {
    this.roleHttpService.getRole().subscribe(
      reponse=> {
        let listeRoles = reponse.outputRoles;
        for(let i of listeRoles){
          this.roles.push(i.nom);
        }
        console.log(this.roles)
      },
      error =>{
        console.log(error);
      }
    )
  }
  //---------------------------------------------------- UTILISATEURS --------------------------------------------------------------------




  inscrireUtilisateur(){
    this.inscriptionForm.get('nbCongesPoses')?.setValue('0');
    this.inscriptionForm.get('nbCongesRestant')?.setValue('0');
    let nbc = this.inscriptionForm.get('nbCongesCumules');
    let date = this.inscriptionForm.get('dateEntree');
    let vDate: string = date?.value;
    date?.setValue(`${vDate.split('/')[2]}-${vDate.split('/')[1]}-${vDate.split('/')[0]}`);
    nbc?.setValue(''+ nbc?.value);
    this.utilisateurHttpService.addUtilisateurs(this.inscriptionForm.value).subscribe(
      reponse=> {
        this.message = "L'utilisateur a bien été créé"
      },
      error => {
        this.messageErreur = error;
      }
    )
    console.log(this.inscriptionForm);
    this.inscriptionForm.reset();
  }

  modifierUtilisateur(){

  }

  supprimerUtilisateur(){

  }

  resetMessage() {
    this.message = '';
  }
}
