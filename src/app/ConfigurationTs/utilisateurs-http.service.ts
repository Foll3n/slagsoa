import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilisateursHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getUtilisateurs(){
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}/${sessionStorage.getItem('idUtilisateur')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions );


  }
}
