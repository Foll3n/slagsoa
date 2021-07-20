import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {environment} from "../../environments/environment";
import { UtilisateursHttpService } from "../ConfigurationTs/utilisateurs-http.service";
import {Utilisateur} from "../Modeles/utilisateur";

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
  userSubject = new Subject<Utilisateur>();
  user!: Utilisateur;
  urlConnexion = '';

  rpc = new ReponseConnexion();
  httpOptions = {
    headers: new HttpHeaders()
  };

//-------------------------------------------------- DEBUT CONSTRUCTOR + NGONINIT ----------------------------------------------------



  constructor(private http: HttpClient, private router: Router , private userHttp: UtilisateursHttpService) {
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


  emitUser(){
    //console.log(this.user);
    let c = new Utilisateur();
    c.nom = this.user.nom;
    console.log(c);
    this.userSubject.next(c);
  }

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
    return(sessionStorage.getItem('role') == 'MANAGER');
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
    // sessionStorage.setItem('role', 'superAdmin');
    // sessionStorage.setItem('idUtilisateur' , '12');

    //on envoie le ndc  et mdp pour récupérer le token
    //sessionStorage.setItem('token', '');
    sessionStorage.setItem('ndc', 'Administrator');
    sessionStorage.setItem('mdp', 'manage');

    //------------------------

    //Si token != null alors on récupère l'id utilisateur

    sessionStorage.setItem('idUtilisateur', '13');

    //------------------------


    //On récupère ensuite le reste des données
    this.chargerUtilisateur();

  }

  getUtilisateur(){
    console.log(this.user);
    return this.user;
  }

  chargerUtilisateur(){
    this.userHttp.getUtilisateurs().subscribe(
      resultat => {
        console.log(resultat);
        let a = resultat.getAllutilisateurOutput;
        this.user = new Utilisateur();
          for(let i of a){
            if(i.id == sessionStorage.getItem(`idUtilisateur`)){
              this.user.nom = i.nom;
              this.user.prenom = i.prenom;
              this.user.mail = i.mail;
              this.user.grade = i.grade;
              this.user.role = i.role;
              this.user.nbCongesCumules = i.nbCongesCumules
              this.user.nbCongesPoses = i.nbCongesPoses;
              this.user.nbCongesRestant = i.nbCongesRestant;
              this.emitUser();
            }
          }

        this.router.navigate(['/accueil']);

      },
      error => {
        console.log(error);
        this.Logout();
      }
    )


  }

}
