import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Conge} from "../partage/Modeles/conge";

export class responseConge{
  body!: string;
  choix!: string;
  idConges!: string;
  idUtilisateur!: string;
}

@Injectable({
  providedIn: 'root'
})
export class CongesHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`})
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getConges(){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${sessionStorage.getItem('id')}`;

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

  responseConges(rc: responseConge){
    let idu = sessionStorage.getItem('id');
    if(idu) {
      rc.idUtilisateur = idu;
    }
    const href = environment.urlConges;
    const requestUrl =
      `${href}`;
    return this._httpClient.put<any>(requestUrl, rc,  this.httpOptions);
  }
}


