import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {CraWeekInsert} from '../Cra/models/logCra/craWeekInsert';
import {CraHttpDatabase} from '../configuration-http/CraHttpDatabase';
import {LogCraHttpDatabase} from '../configuration-http/LogCraHttpDatabase';
import {Log} from '../Cra/models/logCra/Log';


@Injectable()
export class CraWaitingService {

  waitingSubject = new Subject<CraWeekInsert[]>();
  validateSubject = new Subject<CraWeekInsert[]>();
  public listeCraWaiting: CraWeekInsert[] = [];
  public listeCraValidate: CraWeekInsert[] = [];
  constructor(private httpClient: HttpClient) {


  }
  httpOptions = {
    headers: new HttpHeaders()
  };
  initialisation(){
    this.fillListeCraWaiting('1');
    this.fillListeCraWaiting('2');
  }

  emitCraWaintingSubject(): void {
    this.waitingSubject.next(this.listeCraWaiting.slice());
    this.validateSubject.next(this.listeCraValidate.slice());
  }

  fillListeCraWaiting(index:string){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekWaiting(index);
    console.log("reponse ::::: " , response);
    response.subscribe(reponse => {
      console.log(reponse.status + '______________________________________');
      if(reponse.status == 'OK'){
        console.log(" -----kkkkkkkkkkkkkkkkk ---" ,reponse);
        // this.listeCraWaiting = this.sortList(reponse.listeCraWeek);
        if (index == '1' && reponse.listeCraWeek){
          this.listeCraWaiting = reponse.listeCraWeek;
        }
        else if(index == '2' && reponse.listeCraWeek){
          this.listeCraValidate = reponse.listeCraWeek;
        }
        if(reponse.listeCraWeek != null)
          this.emitCraWaintingSubject();

      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }
  validerCra(cra: CraWeekInsert, commentaire:string){
    cra.status = '2';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.deleteCraWait(cra);
        this.listeCraValidate.push(cra);
        this.emitCraWaintingSubject();
        // met à jour automatiquement
        this.makeLog(cra,commentaire);
      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }
  deleteCraWait(cra: CraWeekInsert){
    const c = this.getCraWeek(cra);
    if (c){
      const index = this.listeCraWaiting.indexOf(c, 0);
      this.listeCraWaiting.splice(index, 1);
    }

  }
  public getCraWeek(cra: CraWeekInsert): CraWeekInsert | null {
    if (cra.idCra){
      const res = this.listeCraWaiting.find(
        (c) => c.idCra === cra.idCra);
      return res as CraWeekInsert;
    }
    return null;
  }
  refuserCra(cra: CraWeekInsert, commentaire: string){
    cra.status = '0';
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(cra);
    response.subscribe(reponse => {
      this.deleteCraWait(cra);
      this.emitCraWaintingSubject();
      this.makeLog(cra,commentaire);
    });



  }
  makeLog(cra:CraWeekInsert, commentaire:string){
    if (!commentaire){
      commentaire = 'Compte rendu invalide';
    }
    commentaire.substr(0,254);
    let log = new Log('',`${sessionStorage.getItem('id')}`,cra.idUsr,cra.status,commentaire,cra.idCra!.toString());
    console.log("log : ",log);
    const logHttp = new LogCraHttpDatabase(this.httpClient);
    const res = logHttp.addLog(log);
    res.subscribe(reponse => {
      console.log(reponse);
    });
  }
}
