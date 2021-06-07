import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

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

  //url = 'http://192.168.1.12:5555/rest/ws.connexion';
  url = 'http://192.168.1.12:4555/gateway/APIConnexion/1.0/connexion';

  rpc = new ReponseConnexion();
  httpOptions = {
    headers: new HttpHeaders()
  };

//-------------------------------------------------- DEBUT CONSTRUCTOR + NGONINIT ----------------------------------------------------



  constructor(private http: HttpClient, private router: Router) { }

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
    return(sessionStorage.getItem('ndc') != null);
  }

  public read(){
    return(sessionStorage.getItem('role') == 'utilisateur');
  }

  public write(){
    return(sessionStorage.getItem('role') == 'admin' || sessionStorage.getItem('role') == 'superAdmin');
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
    if(this.logForm.get('ndc')?.value && this.logForm.get('mdp')?.value){
      this.message = '';
      let body =  JSON.stringify(this.logForm.value) ;
      this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(this.logForm.get('ndc')?.value + ':'+this.logForm.get('mdp')?.value)})
      this.http.post(this.url, JSON.parse(body) , this.httpOptions).subscribe(
        reponse => {
          // @ts-ignore
          this.rpc = reponse;
          if(this.rpc.reponse == 'OK'){
            //this.message = "Connexion réussie !";
            //this.message = this.rpc.message;
            let m = this.rpc.message.split(';');
            sessionStorage.setItem('ndc', m[0]);
            sessionStorage.setItem('role', m[1]);
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
  }
}
