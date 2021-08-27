import {Injectable} from '@angular/core';
import {Cra} from '../Cra/models/cra/Cra';
import {Subject} from 'rxjs';
import {CompteRendu} from '../Cra/models/compteRendu/CompteRendu';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {environment} from '../../environments/environment';
import {InsertCra} from '../Cra/models/cra/InsertCra';
import {CraHttpDatabase} from '../configuration-http/CraHttpDatabase';
import {CraWeek} from '../Cra/models/cra/craWeek';
import {CompteRenduInsert} from '../Cra/models/compteRendu/CompteRenduInsert';
import {Commande} from '../Cra/models/commande/Commande';
import {BigCommande} from '../Cra/models/commande/BigCommande';
import {CraWeekInsert} from '../Cra/models/logCra/craWeekInsert';
import {Result} from '../Cra/models/Result';
import {CraWaitingService} from './craWaiting.service';

@Injectable()
/**
 * Service uniquement utilisable dans la vue du compte rendu à la semaine permettant de récupérer l'ensemble des informations nécessaires
 */
export class CraService {
  public back!: boolean;

  constructor(private httpClient: HttpClient, private craWaintingService: CraWaitingService) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

  }

  httpOptions = {
    headers: new HttpHeaders()
  };
  currentSlide = 0;
  dateToday!: Date;
  listeCraWeek: CraWeek[] = [];
  craWeekLast!: CraWeek;
  craWeek!: CraWeek;
  craWeekNext!: CraWeek;
  public listeCommandes: Commande[] = [];
  craSubject = new Subject<CraWeek[]>();
  private listeCra: Cra[] = [];

  /**
   * Initialise notre service du cra à la semaine en lui passant une date
   * @param date
   */
  initialisation(date: Date, back = false) {
    this.back = back;

    this.dateToday = new Date();
    this.initialisationMois(date);
    this.fillWeeks();
  }


  initialisationMois(date: Date) {
    let save = new Date(date);
    date.setDate(date.getDate());
    this.listeCraWeek = [];
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    var firstDate = new Date(year, month, 1);
    if (firstDate.getDay() > 1) {
      firstDate.setDate(firstDate.getDate() - firstDate.getDay());
    }
    var lastDate = new Date(year, month + 1, 1);
    if (lastDate.getDay() - 1 > 0) {
      lastDate.setDate(lastDate.getDate() + (7 - lastDate.getDay()));
    }
    let id = 0;
    while (firstDate.getTime() < lastDate.getTime()) {
      var diff = (save.getTime() - firstDate.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if ((diffDays) <= 7 && diffDays > 0) {
        this.currentSlide = id;
      }
      this.listeCraWeek.push(new CraWeek(id, firstDate));
      id++;
      firstDate.setDate(firstDate.getDate() + 7);
    }


  }

  /**
   * permet d'envoyer à touts les composants abonées la liste de cra Semaine
   */
  emitCraSubject(): void {
    // tslint:disable-next-line:triple-equals
    this.craSubject.next(this.listeCraWeek.slice());
  }

  /**
   * Renvoie la date du jour en français dans un format particulier pour le titre
   */
  getDateToday() {
    return formatDate(this.dateToday, 'dd MMMM yyyy', 'fr');
  }

  /**
   * Ajoute une ligne correspondant à une commande précise dans la semaine actuelle
   * @param cr
   * @param index
   * @param commande
   */
  addCr(cr: CompteRendu, index: number, commande: Commande): void {
    const listeCr = [];
    for (const cra of this.listeCraWeek[index].listeCra) {
      const compteRendu = new CompteRendu(cra.id_cra, cr.numCommande, cr.duree, cr.color);
      cra.listeCr.push(compteRendu);
      listeCr.push(compteRendu);

    }
    this.addCraLine(index, listeCr, commande);


  }

  /**
   * Ajoute un cra à la liste des cras de la semaine
   * @param cra
   * @param index
   */
  addCra(cra: Cra, index: number): void {
    this.listeCraWeek[index].listeCra.push(cra);
    this.emitCraSubject();
  }

  /**
   * récupère un cra précis dans la liste des semaines de cra
   * @param id
   * @param index
   */
  public getCraById(id: number, index: number): Cra {
    const cra = this.listeCraWeek[index].listeCra.find(
      (craObject) => craObject.id_cra === id);
    return cra as Cra;
  }

  /**
   * Fonction inutile qui permet de mettre le status du congé à 1
   * @param index
   */
  validConge(index: number): void {
    for (const cra of this.listeCraWeek[index].listeCra) {
      cra.statusConge = 1;
    }
    this.emitCraSubject();
  }

  /**
   * renvoie la durée totale d'un cra particulier dans la liste des cra d'une semaine précise (number)
   * @param idCra
   * @param index
   */
  getDureeTotaleCra(idCra: number, index: number): number {
    return this.getCraById(idCra, index).duree_totale;
  }

  /**
   * Afficher un cra
   * @param index
   */
  affichercra(index: number): void {
    console.log(this.listeCraWeek[index].listeCra);
  }

  /**
   * fonction permettant de définir comment on compare deux cras
   * @param cra
   */
  findIndexToUpdate(cra: Cra): void {
    // @ts-ignore
    return cra.id_cra === this;
  }

  /**
   * Met à jour un cra précis donné en paramètre (jamais utilisé)
   * @param cra
   * @param index
   */
  editCra(cra: Cra, index: number): void {
    const updateItem = this.listeCraWeek[index].listeCra.find(this.findIndexToUpdate, cra.id_cra);
    let ind = 0;
    if (updateItem instanceof Cra) {
      ind = this.listeCraWeek[index].listeCra.indexOf(updateItem);
      this.listeCraWeek[index].listeCra[ind] = cra;
      this.emitCraSubject();
    }
  }

  /**
   * Permet de mettre à jour la durée d'un compte rendu passé en paramètre
   * @param idCra
   * @param duree
   * @param indexCr
   * @param indexCraWeek
   */
  editCraDuree(idCra: number, duree: number, indexCr: number, indexCraWeek: number): void {
    const updateItem = this.listeCraWeek[indexCraWeek].listeCra.find(x => x.id_cra === idCra);
    // @ts-ignore
    if (updateItem instanceof Cra) {
      const index = this.listeCraWeek[indexCraWeek].listeCra.indexOf(updateItem);
      const save = this.listeCraWeek[indexCraWeek].listeCra[index].listeCr[indexCr].duree;
      this.listeCraWeek[indexCraWeek].listeCra[index].listeCr[indexCr].duree = duree;
      this.listeCraWeek[indexCraWeek].listeCra[index].duree_totale = +(this.listeCraWeek[indexCraWeek].listeCra[index].duree_totale - save + duree).toPrecision(2);
      this.emitCraSubject();
    }

  }

  /**
   * Transforme une liste d'objets de type InsertCra en liste de Cra que l'on set directement à notre listeCraWeek
   * @param liste_cra
   * @param index
   */
// tslint:disable-next-line:variable-name
  public transform(liste_cra: InsertCra[], index: number): void {
    this.listeCraWeek[index].listeCra = [];
    for (const cra of liste_cra) {

      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.statusConge;
      const listCr = [];
      if (cra.listeCr != null) {
        for (const sp of cra.listeCr) {
          listCr.push(new CompteRendu(id, sp.id_commande, +sp.duree, sp.color));
        }
      }
      this.listeCraWeek[index].listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
    }

  }

  /**
   * Fonction qui prend un tableau de cra en paramètre et renvoie un tableau d'insertCra
   */
  // tslint:disable-next-line:variable-name
  public transformToInsertCra(liste_cra: Cra[]): InsertCra[] {
    const res = [];
    for (const cra of liste_cra) {
      const id = cra.id_cra.toString();
      const idUsr = cra.id_usr.toString();
      const duree = cra.duree_totale.toString();
      const status = cra.statusConge.toString();
      const listCr = [];
      for (const sp of cra.listeCr) {
        listCr.push(new CompteRenduInsert(id, sp.numCommande, duree, sp.color));
      }
      res.push(new InsertCra(id, idUsr, formatDate(cra.date, 'yyyy-MM-dd', 'fr'), duree, status, listCr));
    }
    return res;
  }

  /**
   * Appel API pour supprimer un cra à la semaine mais jamais utilisé
   * @param index
   */
  supprimer(index: number): void {
    const json = JSON.stringify(this.transformToInsertCra(this.listeCraWeek[index].listeCra));
    this.httpClient.delete<Result>(environment.urlCra, this.httpOptions).subscribe(
      response => {
        if (response.status == 'OK') {
          console.log('récupération datas');
        } else {
          console.log('Erreur de requete de base de données');
        }
        console.log('suppression -> ' + response);
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Appel API pour ajouter une ligne (une commande) à notre Cra de semaine
   * @param index
   * @param listeCompteRendu
   * @param commande
   */
  addCraLine(index: number, listeCompteRendu: CompteRendu[], commande: Commande) {
    // tslint:disable-next-line:ban-types
    const listeCompte: CompteRenduInsert [] = [];

    for (const cr of listeCompteRendu) {
      listeCompte.push(new CompteRenduInsert(cr.idCra.toString(), cr.numCommande, '0.0', cr.color));
    }
    const json = JSON.stringify(listeCompte);
    this.httpClient.post<Result>(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        if (response.status == 'OK') {
          // this.getDistinctCommandsWeek(index);
          if (this.listeCraWeek[index].listeCommandesWeek) {
            this.listeCraWeek[index].addCom(commande); ///////////////////////////////////////////////////////////////////////////////
          } else {
            this.listeCraWeek[index].setListeCom([commande]);
          }
          this.emitCraSubject();
        } else {
          console.log('Erreur de requete de base de données');
        }

      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Récupère la liste des cras en lui passant l'index de la semaine à récupérer
   * @param index
   */
  getCraToServer(index: number): void {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, `${sessionStorage.getItem('id')}`);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.liste_cra != null) {
          this.transform(reponse.liste_cra, index);
          this.getCraWeekStatus(index);
        } else {
          this.addCraWeek(index);

          //this.getCraToServer(index);
        }

      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * Récupère la liste des commandes d'une semaine pour un utilisateur
   * @param index
   */
  getDistinctCommandsWeek(index: number, id_usr: string): void {
    const requestUrl = environment.urlCommande + '/' + this.listeCraWeek[index].firstDateWeekFormat + '/' + this.listeCraWeek[index].lastDateWeekFormat + '/' + id_usr;
    this.httpClient.get<BigCommande>(requestUrl, this.httpOptions).subscribe(
      response => {
        this.listeCraWeek[index].listeCommandesWeek = (response.listeCommande); ///////////////////////////////////////// a ckeck je peux aussi faire: this.findAllAvailableCommandes pour récupérer que cellles qui sont available
        // this.getCraToServer(index); // patch car je reload tout le serveur
        this.emitCraSubject();
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  findAllAvailableCommandes(commandes: Commande[]) {
    let res = [];
    if (commandes) {
      for (const com of commandes) {
        if (com.available == 'true') {
          res.push(com);
        }
      }
    }
    return res;
  }

  /**
   * Ajoute + 1 à la date actuelle et renvoie le résultat sous forme de string bien formé
   * @param date
   * @param nbDays
   */
  addJour(date: Date, nbDays: number): string {
    const res = new Date(date);
    res.setDate(res.getDate() + nbDays);
    return formatDate(res, 'yyyy-MM-dd', 'fr');
  }

  /**
   * Sauvegarde une semaine de CRA
   * @param index
   */
  saveCra(index: number) {
    const send: CompteRenduInsert[] = [];
    for (const cra of this.listeCraWeek[index].listeCra) {
      for (const cr of cra.listeCr) {
        send.push(new CompteRenduInsert(cr.idCra.toString(), cr.numCommande.toString(), cr.duree.toString(), cr.color));
      }
    }
    const json = JSON.stringify(send);
    this.httpClient.put<Result>(environment.urlCr, json, this.httpOptions).subscribe(
      response => {
        if (response.status == 'OK') {
        } else {
          console.log('Erreur de requete de base de données');
        }
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * renvoie le status du cra Semaine passé en paramètre
   * @param index
   */
  getCraWeekStatus(index: number): void {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCraWeekStatus(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat);

    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        this.listeCraWeek[index].setStatus(reponse.statusCra);
        this.getDistinctCommandsWeek(index, `${sessionStorage.getItem('id')}`);

      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * Appel API pour ajouter une semaine de cra
   * @param index
   */
  addCraWeek(index: number) {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.addCraWeek(new CraWeekInsert(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, '0', `${sessionStorage.getItem('id')}`));
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        this.addCraServer(index);
      } else {
        console.log('Erreur de requete de base de données');
      }
      //this.emitCraSubject();
    });
  }

  /**
   * Met à jour le statusCra d'une semaine précise d'un utilisateur
   * @param index
   * @param status
   */
  updateStatusCraUtilisateur(index: number, status: string) {
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.updateStatusCraWeek(new CraWeekInsert(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, status, `${sessionStorage.getItem('id')}`));
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        this.listeCraWeek[index].status = status;
        this.emitCraSubject();
        this.craWaintingService.listeCraWaiting.push(new CraWeekInsert(this.listeCraWeek[index].firstDateWeekFormat, this.listeCraWeek[index].lastDateWeekFormat, status, `${sessionStorage.getItem('id')}`));
        this.craWaintingService.emitCraWaintingSubject();
      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * Appel API afin d'ajouter des cras en base de donnée
   * @param index
   */
  addCraServer(index: number): void {
    // tslint:disable-next-line:ban-types
    const listeCraWeek: InsertCra [] = [];
    for (let i = 0; i < 5; i++) {
      const cra = new InsertCra('', `${sessionStorage.getItem('id')}`, this.addJour(this.listeCraWeek[index].firstDateWeek, i), '0', '0', []);
      listeCraWeek.push(cra);
    }
    const json = JSON.stringify(listeCraWeek);
    this.httpClient.post<Result>(environment.urlCra, json, this.httpOptions).subscribe(
      response => {
        if (response.status == 'OK') {
          this.getCraToServer(index);
        } else {
          console.log('Erreur de requete de base de données');
        }
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * remplie trois semaines de CRA
   */
  fillWeeks() {
    for (let i = 0; i < this.listeCraWeek.length; i++) {
      this.getCraToServer(i);
    }
  }

  /**
   * supprime une ligne correspondant à une commande précise dans notre semaine (suppression des comptes rendus)
   * @param commande
   * @param index
   */
  deleteLineToServer(commande: Commande, index: number) {
    const requestUrl = environment.urlCr + '?commande=' + commande.id + '&date_start=' + this.listeCraWeek[index].firstDateWeekFormat + '&date_end=' + this.listeCraWeek[index].lastDateWeekFormat + '&id_usr=' + `${sessionStorage.getItem('id')}`;
    this.httpClient.delete(requestUrl, this.httpOptions).subscribe(
      response => {
        this.deleteLine(commande, index);
        this.emitCraSubject();
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Set status congé jamais utilisé car on ne modifie jamais le status du congé
   * @param index
   */
  setStatusCongeUserToServer(index: number) {
    const json = JSON.stringify(this.transformToInsertCra(this.listeCraWeek[index].listeCra));
    this.httpClient.put(environment.urlCra, json, this.httpOptions).subscribe(
      response => {
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

  /**
   * Met à jour le status d'un craWeek (validé par l'utilisateur)
   * @param index
   * @param status
   */
  setStatusUser(index: number, status: string) {
    this.updateStatusCraUtilisateur(index, status);
  }

  /**
   * Appel API plus au service pour supprimer une ligne dans notre cra à la semaine (c'est à dire supprimer une commande)
   *
   * @param commande
   * @param index
   */
  deleteLine(commande: Commande, index: number) {
    for (const cra of this.listeCraWeek[index].listeCra) {
      for (const cr of cra.listeCr) {
        // tslint:disable-next-line:triple-equals
        if (cr.numCommande == commande.id) {
          const ind = cra.listeCr.indexOf(cr, 0);
          cra.duree_totale -= cr.duree;
          cra.listeCr.splice(ind, 1);

        }
      }
    }
    const comToDelete = this.listeCraWeek[index].listeCommandesWeek.indexOf(commande);
    this.listeCraWeek[index].listeCommandesWeek.splice(comToDelete, 1);
  }
}
