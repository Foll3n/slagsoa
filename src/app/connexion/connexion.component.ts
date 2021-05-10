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

  rpc = new ReponseConnexion();
  loginUserData = {};
  httpOptions = {
    headers: new HttpHeaders()
  };



  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    console.log(sessionStorage);
    this.logForm = new FormGroup({
      ndc: new FormControl(),
      mdp: new FormControl()
    });
    //sessionStorage.setItem('ndc', 'l');
    //sessionStorage.setItem('mdp', 'ok');
  }

  public isLogged(){
    return(sessionStorage.getItem('ndc') != null);
  }

  public Logout(){
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }

  public testLogin(){
    if(!this.isLogged()){
      this.router.navigate(['/connexion']);
    }
  }

  connexion: string = '';
  ndc!: FormControl;
  mdp!: FormControl;
  logForm!: FormGroup;
  message!: string;
  url = 'http://localhost:5555/rest/ws/connexion/';

  onSubmit() {
    if(this.logForm.get('ndc')?.value && this.logForm.get('mdp')?.value){
      this.message = '';
      let body = '[' + JSON.stringify(this.logForm.value) + ']';
      console.log("'" +this.logForm.get('ndc')?.value + ':'+this.logForm.get('mdp')?.value+ "'");
      this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(this.logForm.get('ndc')?.value + ':'+this.logForm.get('mdp')?.value)})
      this.http.post(this.url, JSON.parse(body) , this.httpOptions).subscribe(
        reponse => {
          // @ts-ignore
          this.rpc = reponse;
          if(this.rpc.reponse == 'OK'){
            //this.message = "Connexion réussie !";
            this.message = this.rpc.message;
            sessionStorage.setItem('ndc', this.rpc.message);
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
