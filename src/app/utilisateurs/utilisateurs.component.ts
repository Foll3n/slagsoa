import { Component, OnInit } from '@angular/core';
import { ConnexionComponent } from "../connexion/connexion.component";
import { HttpClient , HttpHeaders } from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {Utilisateur } from "../Modeles/utilisateur";

export class Role{
  role!: string;
}
export class ReponseUtilisateur{
  message!: Role[];
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
  url = 'http://localhost:5555/rest/';

  ru = new ReponseUtilisateur();
  message = "";
  active = 'top';

  httpOptions = {
    headers: new HttpHeaders()
  };

  inscriptionForm!: FormGroup;
  constructor(public http: HttpClient, public con: ConnexionComponent) { }

  ngOnInit(): void {
    this.inscriptionForm = new FormGroup({
      ndc: new FormControl(),
      mdp: new FormControl(),
      mdp1: new FormControl(),
      role: new FormControl()
    });
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
    this.roles = [];
    this.con.testLogin();
    this.chargerRoles();
  }



  chargerRoles(){
    this.message = '';
    this.http.get(this.url+ 'ws.role', this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.ru = reponse;
        if(this.ru.reponse == 'OK'){
          console.log(reponse);
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
  inscrireUtilisateur(){
    let u = new Utilisateur();
    u.ndc = this.inscriptionForm.get('ndc')?.value;
    u.mdp = this.inscriptionForm.get('mdp')?.value;
    u.role = this.inscriptionForm.get('role')?.value;
    let b = '[' + JSON.stringify(u) + ']';
    this.http.post(this.url + 'ws.utilisateurs', this.httpOptions).subscribe(
      reponse=> {
          let r= new Reponse();
          // @ts-ignore
          r= reponse;
          console.log(r);
      },
      error => {

      }
    )
  }
}
