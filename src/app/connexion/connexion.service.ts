import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from "rxjs";
import {Utilisateur} from "../Modeles/utilisateur";
import {HttpClient} from "@angular/common/http";
import {UtilisateursHttpService} from "../configuration-http/utilisateurs-http.service";
import {dateFormatter} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  users: Utilisateur[] = [];
  usersSubject = new Subject<Utilisateur[]>();


  constructor(private http: HttpClient, private router: Router , private userHttp: UtilisateursHttpService) { }

  emitUserSubject() {
    this.usersSubject.next(this.users.slice());
  }

  public isLogged(){
    //console.log(sessionStorage.getItem('ndc'))
    return(sessionStorage.getItem('id') != null && sessionStorage.getItem('token') != null);
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

  public testLogin() {
    if (!this.isLogged()) {
      this.router.navigate(['/connexion']);
    }
  }

  chargerUtilisateur(){
    this.users = [];
    this.userHttp.getUtilisateurs().subscribe(
      resultat => {
        let a = resultat.getAllutilisateurOutput;
        for(let i of a){
          if(i.id == sessionStorage.getItem(`id`)){
            let a = new Utilisateur()
            a.role = i.role;
            a.grade = i.grade;
            a.nom = i.nom
            a.prenom = i.prenom;
            a.mail = i.mail;
            a.nbCongesCumules = i.nbCongesCumules;
            a.nbCongesPoses = i.nbCongesPoses;
            a.nbCongesRestant = i.nbCongesRestant;
            a.dateEntree = dateFormatter(i.dateEntree);
            a.congesEnAttente = '5';
            this.users.push(a);
            this.emitUserSubject();
          }
        }
      },
      error => {
        console.log(error);
        this.Logout();
      }
    )
  }



  // getUtilisateur(){
  //   console.log(this.user);
  //   return this.user;
  // }
}
