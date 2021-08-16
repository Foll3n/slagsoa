import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {CommandeInsert} from '../Cra/models/commande/CommandeInsert';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Projet} from '../Cra/models/projet/Projet';
import {FormGroupDirective} from '@angular/forms';
import {resetForm, shortMessage} from '../../environments/environment';



@Injectable()
/**
 * Class non utilisée pour le moment
 */
export class CommandeService {
  userId = '10';
  listeCommandes: CommandeInsert[] = [];

  commandeSubject = new Subject<CommandeInsert[]>();
  addCommandeSubject = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getAllCommandes();
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitCommandeSubject(): void {
    this.commandeSubject.next(this.listeCommandes.slice());
  }
  emitAddCommandeSubject(bool:boolean): void {
    this.addCommandeSubject.next(bool);
  }
  /**
   * ajoute une commande à un projet. On créé la commande grâce aux champs du formulaire
   */
  addCommande(commande: CommandeInsert) {
        const commandeHttp = new CommandeHttpDatabase(this.httpClient);
        const response = commandeHttp.addCommande(commande);
        response.subscribe(reponse => {
          if (reponse.status === 'OK') {
            console.log("commande bien ajoutée");
            this.getAllCommandes();
          } else {
            console.log("commande non ajoutée");
          }
        });

  }

  updateCommandes(commandes: CommandeInsert[]){
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.updateCommands(commandes);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.updateCommands(commandes);
        // this.getAllCommandes();
      }
      else{
        this.emitAddCommandeSubject(false);
      }
    });
  }
  copyCommande(com:CommandeInsert, toCom:CommandeInsert){
    toCom.id = com.id;
    toCom.num_com = com.num_com;
    toCom.id_projet = com.id_projet;
    toCom.color = com.color;
    toCom.available = com.available;
  }
  updateCommands(commandes:CommandeInsert[]){
    for (let com of commandes){
      let res = this.getComById(com.id);
      this.copyCommande(com, res);
    }
    console.log(this.listeCommandes);
    this.emitAddCommandeSubject(true);
    this.emitCommandeSubject();
  }
  projectHaveCommande(numCommande: string, idProjet: string){
    for (const commande of this.listeCommandes){
      if (commande.num_com == numCommande) {
        if (commande.id_projet == idProjet){
          return true;
        }
      }
    }
    return false;
  }

  isProjetInRealisations(listeRealisation: Realisation[], projet: Projet){
     for (const real of listeRealisation) {
       return (this.projectHaveCommande(real.num_commande, projet.id))
     }
     return false;
  }
  /**
   * récupère un cra précis dans la liste des semaines de cra
   * @param id
   * @param index
   */
  public getComById(id: string): CommandeInsert {
    const com = this.listeCommandes.find(
      (com) => com.id === id);
    return com as CommandeInsert;
  }
  getAllCommandes(){
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommands();
    response.subscribe(reponse => {
      if (reponse.status == 'OK'){

        console.log(reponse);
        if (reponse.listeCommande)
        this.listeCommandes = reponse.listeCommande;
        this.emitCommandeSubject();
      }
      else{
        console.log("Erreur: getAllCommandsProjet");
      }
    });
  }
}
