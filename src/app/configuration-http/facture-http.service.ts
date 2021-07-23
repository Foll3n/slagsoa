import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Conge} from "../Modeles/conge";

@Injectable({
  providedIn: 'root'
})
export class FactureHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`})
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getFacture(idUtilisateur: string){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${sessionStorage.getItem('idUtilisateur')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);
  }

  deleteFacture(idConges: string){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${idConges}`;
    return this._httpClient.delete<any>(requestUrl, this.httpOptions);
  }

  addFacture(cge: Conge){
    const href = environment.urlConges;
    const requestUrl =
      `${href}`;
    return this._httpClient.post<any>(requestUrl, cge, this.httpOptions);
  }

  updateFacture(cge: Conge){
    const href = environment.urlConges;
    const requestUrl =
      `${href}`;
    return this._httpClient.post<any>(requestUrl, cge, this.httpOptions);
  }

}
