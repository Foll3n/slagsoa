import {CompteRendu} from '../compteRendu/CompteRendu';
import {Cra} from './Cra';
import {formatDate} from '@angular/common';
import {CommandeInsert} from '../commande/CommandeInsert';
import {environment} from '../../../../environments/environment';
import {BigCommande} from '../commande/BigCommande';


export class CraWeek {
  public listeCra: Cra[] = [];
  public dayDate: Date;
  public firstDateWeekFormat: string;
  public lastDateWeek: Date;
  public firstDateWeek: Date;
  public lastDateWeekFormat: string;
  public dateToday: string;
  public lastDate: string;
  public firstDate: string;
  public id: number;
  public listeCommandesWeek: CommandeInsert[] = [];
  public status = '0';

  constructor(id: number, dateDay: Date) {
    dateDay = new Date(dateDay);
    this.id = id;
    this.dayDate = new Date(dateDay);
    this.firstDateWeek = new Date(dateDay.setDate(dateDay.getDate() - dateDay.getDay() + 1));
    this.firstDateWeekFormat = formatDate(this.firstDateWeek, 'yyyy-MM-dd', 'fr');
    this.lastDateWeek = new Date(dateDay.setDate(dateDay.getDate() - dateDay.getDay() + 7));
    this.lastDateWeekFormat = formatDate(this.lastDateWeek, 'yyyy-MM-dd', 'fr');

    this.dateToday = formatDate(dateDay, 'dd MMMM yyyy', 'fr');
    this.lastDate = formatDate(this.lastDateWeek, 'dd MMMM ', 'fr');
    this.firstDate = formatDate(this.firstDateWeek, 'dd MMMM ', 'fr');
  }

  setListeCra(listeCra: Cra[]): void{
    this.listeCra = listeCra;
  }
  setListeCom(listeCommande: CommandeInsert[]): void{
    this.listeCommandesWeek = listeCommande;
  }
  addCom(commande: CommandeInsert): void{
    this.listeCommandesWeek.push(commande);
  }
  setStatus(status: string){
    this.status = status;
  }

  afficher(){
    console.log('----------- CRA-----------\n');
    console.log('liste cra : ' + this.listeCra);
    for (const i of this.listeCra){
      console.log('cra : ' + i.id_cra + ' duree : ' + i.duree_totale +" liste CR len "+i.listeCr.length);
    }
  }
}
