import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from '../../environments/environment';
import {BigProjet} from '../Cra/models/projet/BigProjet';
import {Projet} from '../Cra/models/projet/Projet';
import {ProjetAdd} from '../Cra/models/projet/ProjetAdd';
import {InsertProjet} from "../Cra/models/projet/InsertProjet";
import {Result} from "../Cra/models/Result";
import {BigStats} from '../Cra/models/projet/BigStats';
import {BigPdf} from '../Cra/models/projet/BigPdf';


/**
 * Classe qui regroupe l'ensemble des appels API de l'api Projet
 */
export class ProjetHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});

  }
  // tslint:disable-next-line:variable-name
  getAllProjects(){
    const href = environment.urlProjet + "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigProjet>(href, this.httpOptions);
  }
  getAllProjectsAvailable(){
    const href = environment.urlProjet + "/available" +  "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigProjet>(href, this.httpOptions);
  }

  ///////////////////////////////// STATS ///////////////////////////////////////////////

  getAllStatsCommandes(dateDebut:string, dateFin:string, codeProjet: string){
    const href = environment.urlProjet + "/stats/commandes" +  "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`
      + "&dateDebut="+dateDebut + "&dateFin=" + dateFin + "&codeProjet=" + codeProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigStats>(href, this.httpOptions);
  }


  getAllStatsUsers(dateDebut:string, dateFin:string, codeProjet: string){
    const href = environment.urlProjet + "/stats/users" +  "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`
      + "&dateDebut="+dateDebut + "&dateFin=" + dateFin + "&codeProjet=" + codeProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigStats>(href, this.httpOptions);
  }
  getAllStatsDurees(dateDebut:string, dateFin:string){
    const href = environment.urlProjet + "/stats/duree" +  "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`
                                        + "&dateDebut="+dateDebut + "&dateFin=" + dateFin;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigStats>(href, this.httpOptions);
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  getPdF(dateDebut:string, dateFin:string, codeProjet: string, idUser: string){
    const href = environment.urlProjet + "/pdf" + "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`
      + "&dateStart="+dateDebut + "&dateEnd=" + dateFin + "&codeProjet=" + codeProjet + "&idUser=" + idUser;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigPdf>(href, this.httpOptions);
  }

  addProjet(projet: Projet){
    const send = new InsertProjet( `${sessionStorage.getItem('id')}`,projet);
    const json =  JSON.stringify(send);
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<ProjetAdd>(href, json, this.httpOptions);
  }
  updateProjet(projet:Projet){
    const send = new InsertProjet( `${sessionStorage.getItem('id')}`,projet);
    const json =  JSON.stringify(send);
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.put<Result>(href, json, this.httpOptions);
  }

  deleteProjet(projet: Projet){
    const href = environment.urlProjet + '/' + projet.id;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.delete(href, this.httpOptions);
  }

}
