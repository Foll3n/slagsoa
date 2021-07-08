import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

export class ReponseConnexion{
  message!: string;
  reponse!: string
}
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
@Injectable({
  providedIn: 'root'
  }
)
export class ConnexionComponent implements OnInit {

  logForm!: FormGroup;

  message!: string;

  urlConnexion = '';

  rpc = new ReponseConnexion();
  httpOptions = {
    headers: new HttpHeaders()
  };

//-------------------------------------------------- DEBUT CONSTRUCTOR + NGONINIT ----------------------------------------------------



  constructor(private http: HttpClient, private router: Router) {
    this.urlConnexion = environment.urlConnexion;
  }

  ngOnInit(): void {
    this.logForm = new FormGroup({
      ndc: new FormControl(),
      mdp: new FormControl()
    });
  }


//-------------------------------------------------- FIN CONSTRUCTOR + NGONINIT ----------------------------------------------------
  /*
  -
  -
  -
  -
   */
//-------------------------------------------------- DEBUT METHODES CONNEXION ACCESSIBLE DE TOUTES LES PAGES ----------------------------------------------------



  public isLogged(){
    //console.log(sessionStorage.getItem('ndc'))
    return(sessionStorage.getItem('ndc') != null);
    //return true;
  }

  public read(){
    return(sessionStorage.getItem('role') == 'utilisateur');
    //return true;
  }

  public write(){
    return(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'superAdmin');
    //return true;
  }

  public Logout(){
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }

  public isSuperAdmin(){
    //return true;
    return(sessionStorage.getItem('role') == 'superAdmin');
  }

  public testLogin(){
    if(!this.isLogged()){
      this.router.navigate(['/connexion']);
    }
  }


  //-------------------------------------------------- FIN METHODES CONNEXION ----------------------------------------------------
  /*
  -
  -
  -
  -
   */
//-------------------------------------------------- DEBUT METHODE CONNEXION POUR LA PAGE CONNEXION----------------------------------------------------


  onSubmit() {
    /*
    if(this.logForm.get('ndc')?.value && this.logForm.get('mdp')?.value){
      this.message = '';
      let body =  JSON.stringify(this.logForm.value) ;
      this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(this.logForm.get('ndc')?.value + ':'+this.logForm.get('mdp')?.value)})
      this.http.post(this.urlConnexion, JSON.parse(body) , this.httpOptions).subscribe(
        reponse => {
          // @ts-ignore
          this.rpc = reponse;
          if(this.rpc.reponse == 'OK'){
            //this.message = "Connexion réussie !";
            //this.message = this.rpc.message;
            let m = this.rpc.message.split(';');
            sessionStorage.setItem('ndc', m[0]);
            sessionStorage.setItem('role', m[1]);
            //sessionStorage.setItem('ndc', m[0]);
            //sessionStorage.setItem('role', m[1]);

            sessionStorage.setItem('mdp', this.logForm.get('mdp')?.value);
            this.router.navigate(['/visualisation']);
          }
          else{
            this.message = "Soucis service";
          }
        },
        error => {
          if(error){
            this.message = "identifiant ou mot de passe incorrect";
          }
        }
      )
    }
    else {
      this.message = 'Champs manquants';
    }
     */
    sessionStorage.setItem('ndc', 'stephanie');
    sessionStorage.setItem('mdp', 'RJEQEFToFDRe2wCgcX73');
    sessionStorage.setItem('role', 'superAdmin');
    this.router.navigate(['/visualisation']);
  }

}
