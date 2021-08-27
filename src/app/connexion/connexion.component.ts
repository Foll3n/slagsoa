import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {environment} from "../../environments/environment";
import { UtilisateursHttpService } from "../configuration-http/utilisateurs-http.service";
import {Utilisateur} from "../partage/Modeles/utilisateur";
import {ConnexionService} from "./connexion.service";
import {NavComponent} from "../nav/nav.component";
import {ConnexionHttpService} from "../configuration-http/connexion-http.service";

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
  user!: Utilisateur;
  urlConnexion!: string;
  httpOptions = {
    headers: new HttpHeaders()
  };

//-------------------------------------------------- DEBUT CONSTRUCTOR + NGONINIT ----------------------------------------------------



  constructor(private connexionHttp: ConnexionHttpService, private http: HttpClient, private router: Router , private userHttp: UtilisateursHttpService, private connexionService: ConnexionService , private nav: NavComponent) {
    this.urlConnexion = environment.urlConnexion;
    this.logForm = new FormGroup({
      ndc: new FormControl('', [Validators.required, Validators.email]),
      mdp: new FormControl()
    });
  }

  getErrorMessage() {
    if (this.logForm.hasError('required')) {
      return 'Champs incorrecte';
    }

    return this.logForm.hasError('ndc') ? 'Email incorrecte' : '';
  }

  ngOnInit(): void {
    if(this.connexionService.isLogged()){
      this.router.navigate(['/accueil']);
    }

  }


  onSubmit() {
    this.connexionHttp.connexion(this.logForm.get('ndc')?.value,
      this.logForm.get('mdp')?.value).subscribe(
      resultat => {

        if(resultat.id){
          sessionStorage.setItem('id' , resultat.id);
          sessionStorage.setItem('token', resultat.token);
          location.reload();
        }
      },
      error => {
        this.message = "erreur lors de l'identification";
      }
    );
  }





}
