import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TypesHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getTypes(){
      const href = environment.urlTypes;
      console.log(sessionStorage.getItem('idUtilisateur'))
      const requestUrl =
        `${href}/${sessionStorage.getItem('idUtilisateur')}`;

      return this._httpClient.get<any>(requestUrl, this.httpOptions );

  }
}
