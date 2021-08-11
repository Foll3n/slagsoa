import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Utilisateur} from "../partage/Modeles/utilisateur";
import {BigRealisation} from '../Cra/models/realisation/BigRealisation';
import {CommandeInsert} from '../Cra/models/commande/CommandeInsert';
import {BigInsertCommande} from '../Cra/models/commande/BigInsertCommande';
import {Result} from '../Cra/models/Result';
import {BigCommande} from '../Cra/models/commande/BigCommande';
import {Responsable} from '../Cra/models/responsable/responsable';
import {BigResponsable} from '../Cra/models/responsable/BigResponsable';
import {BigInsertResponsable} from '../Cra/models/responsable/BigInsertResponsable';
import {Client} from '../Cra/models/client/Client';
import {BigInsertClient} from '../Cra/models/client/BigInsertClient';
import {BigClient} from '../Cra/models/client/BigClient';
import {BigClients} from '../Cra/models/client/BigClients';


export class ClientHttpService {
  httpOptions = {
    headers: new HttpHeaders()
  };
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});
  }

  getAllClients(){
    const href = environment.urlClient + "/all";
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + `${sessionStorage.getItem('id')}` ;
    return this._httpClient.get<BigClients>(requestUrl, this.httpOptions);
  }
  getClient(){
    const href = environment.urlClient ;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + `${sessionStorage.getItem('id')}` ;
    return this._httpClient.get<BigClient >(requestUrl, this.httpOptions);
  }
  addClient(client: Client){
    const send = new BigInsertClient(`${sessionStorage.getItem('id')}`, client);
    const json =  JSON.stringify(send);
    const href = environment.urlClient;
    console.log("json envoyé ___",json);
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }
  updateClient(client: Client){
    const send = new BigInsertClient(`${sessionStorage.getItem('id')}`, client);
    console.log("send --->", send);
    const json =  JSON.stringify(send);
    console.log("json ->>>>>>>>>>>>>>>>>" , json);
    const href = environment.urlClient;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.put<Result>(href, json, this.httpOptions);
  }

}
