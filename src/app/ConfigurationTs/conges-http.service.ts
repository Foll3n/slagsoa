import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Conge} from "../Modeles/conge";

@Injectable({
  providedIn: 'root'
})
export class CongesHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getConges(idUtilisateur: string){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${sessionStorage.getItem('idUtilisateur')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);
  }

  deleteConges(idConges: string){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${idConges}`;
    return this._httpClient.delete<any>(requestUrl, this.httpOptions);
  }

  addConges(cge: Conge){
    const href = environment.urlConges;
    const requestUrl =
      `${href}`;
    return this._httpClient.post<any>(requestUrl, cge, this.httpOptions);
  }

}
