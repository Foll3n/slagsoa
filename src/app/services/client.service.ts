import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Client} from '../Cra/models/client/Client';
import {ClientHttpService} from '../configuration-http/clientHttp.service';



@Injectable()
export class ClientService {
  listeClients: Client[] = [];

  clientSubject = new Subject<Client[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getAllClientsFromServer();

  }
  httpOptions = {
    headers: new HttpHeaders()
  };
  emitClientSubject(): void {
    this.clientSubject.next(this.listeClients.slice());
  }

  getAllClientsFromServer(): void {
    const clientHttp = new ClientHttpService(this.httpClient);
    const response = clientHttp.getAllClients();
    response.subscribe(reponse => {

      if(reponse.status == 'OK'){
        if(reponse.listeClients)
          this.listeClients = reponse.listeClients;
        console.log("reponse client bdd -> ", reponse);
        this.emitClientSubject();
      }
      else{
        console.log("Erreur : get All clients");
      }

    });
  }

  addClient(client: Client): void {
    console.log("client a envoyer",client);
    const clientHttp = new ClientHttpService(this.httpClient);
    const response = clientHttp.addClient(client);
    response.subscribe(reponse => {
    console.log(reponse,'response add ________');
      if(reponse.status == 'OK'){
          this.listeClients.push(client);
        console.log("reponse client bdd ajout client -> ", reponse);
        this.emitClientSubject();
      }
      else{
        console.log("Erreur : add clients");
      }

    });
  }

  updateClient(client: Client){
    const clientHttp = new ClientHttpService(this.httpClient);
    const response = clientHttp.updateClient(client);
    response.subscribe(reponse => {
      console.log(reponse,'----------', client);
      if(reponse.status == 'OK'){
        this.updateInList(client);
        // this.getAllClientsFromServer();
        this.emitClientSubject();
      }
      else{
        console.log("Erreur : get All clients");
      }

    });
  }

  updateInList(client: Client){
    for (const c of this.listeClients){
      if (c.idClient == client.idClient){
        c.mail = client.mail;
        c.adresse = client.adresse;
        c.siret = client.siret;
        c.nomSociete = client.nomSociete;
      }
    }
  }

}

