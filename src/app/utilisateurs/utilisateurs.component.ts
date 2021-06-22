import { Component, OnInit } from '@angular/core';
import { ConnexionComponent } from "../connexion/connexion.component";
import { HttpClient , HttpHeaders } from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {Utilisateur } from "../Modeles/utilisateur";
import {environment} from "../../environments/environment";

export class Role{
  role!: string;
}
export class ReponseUtilisateur{
  message!: any;
  reponse!: string;
}




export class Reponse{
  message!: string;
  reponse!: string;
}


@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {

  roles!: string[];
  utilisateurs!: Utilisateur[];
  urlRole = '';
  urlUtilisateurs = '';

  ru = new ReponseUtilisateur();
  message = "";
  active = 'top';

  httpOptions = {
    headers: new HttpHeaders()
  };

  inscriptionForm!: FormGroup;
  modificationUtilisateur!: FormGroup;
  constructor(public http: HttpClient, public con: ConnexionComponent) {
    this.urlRole= environment.urlRole;
    this.urlUtilisateurs= environment.urlUtilisateurs;
  }

  ngOnInit(): void {
    this.inscriptionForm = new FormGroup({
      ndc: new FormControl(),
      mdp: new FormControl(),
      mdp1: new FormControl(),
      role: new FormControl()
    });
    this.modificationUtilisateur = new FormGroup({
      ndc: new FormControl(),
      mdp: new FormControl(),
      mdp1: new FormControl(),
      role: new FormControl()
    });
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
    this.roles = [];
    this.con.testLogin();
    this.chargerRoles();
    this.chargerUtilisateurs();
  }


//---------------------------------------------------- Roles --------------------------------------------------------------------
  chargerRoles(){
    this.message = '';
    this.http.get(this.urlRole, this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.ru = reponse;
        if(this.ru.reponse == 'OK'){
          for(var i=0; i<this.ru.message.length; i++){
            this.roles.push(this.ru.message[i].role);
          }
        }
        else{
          this.message = "Soucis côté serveur";
        }

      },
      error =>  {
        this.message = ('Le serveur est inaccessbile pour le moment');
      }
    )
  }


  //---------------------------------------------------- UTILISATEURS --------------------------------------------------------------------


  chargerUtilisateurs(){
    this.message = '';
    this.http.get(this.urlUtilisateurs, this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.ru = reponse;
        if(this.ru.reponse == 'OK'){
          this.utilisateurs = this.ru.message;
        }
        else{
          this.message = "Soucis côté serveur";
        }

      },
      error =>  {
        this.message = ('Le serveur est inaccessbile pour le moment');
      }
    )

  }

  inscrireUtilisateur(){
    let u = new Utilisateur();
    u.ndc = this.inscriptionForm.get('ndc')?.value;
    u.mdp = this.inscriptionForm.get('mdp')?.value;
    u.role = this.inscriptionForm.get('role')?.value;
    let b =  JSON.stringify(u) ;

    this.http.post(this.urlUtilisateurs, b, this.httpOptions).subscribe(
      reponse=> {
          let r= new Reponse();
          // @ts-ignore
          r= reponse;
          if(r.reponse == "OK"){
            this.inscriptionForm.reset();
            this.message = "L'utilisateur " + u.ndc + " a bien été inscrit, son role est " + u.role;
          }
      },
      error => {
        this.message = error;
      }
    )
  }

  modifierUtilisateur(){

  }

  supprimerUtilisateur(){

  }
}
