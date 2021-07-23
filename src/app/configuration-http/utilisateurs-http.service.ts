import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilisateursHttpService {
  constructor(private _httpClient: HttpClient) {
  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  getUtilisateurs(){
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`})
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}/${sessionStorage.getItem('id')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions );
  }
}
