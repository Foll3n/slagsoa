import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Commande} from '../Cra/models/commande/Commande';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Projet} from '../Cra/models/projet/Projet';


@Injectable()
/**
 * Class non utilisée pour le moment
 */
export class CommandeService {
  userId = '10';
  listeCommandes: Commande[] = [];
  commandeSubject = new Subject<Commande[]>();
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

  emitAddCommandeSubject(bool: boolean): void {
    this.addCommandeSubject.next(bool);
  }

  getProjetId(idCom: string) {
    for (const com of this.listeCommandes) {
      if (com.id === idCom) {
        return com.id_projet;
      }
    }
    return '';
  }

  /**
   * ajoute une commande à un projet. On créé la commande grâce aux champs du formulaire
   */
  addCommande(commande: Commande, index = false) {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.addCommande(commande);
    response.subscribe(reponse => {
      if (reponse.status === 'OK') {
        if (index) {
          this.getAllCommandes(); // afin d'être à jour
        }
      } else {
        console.log('commande non ajoutée');
      }
    });
  }

  updateCommandes(commandes: Commande[]) {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.updateCommands(commandes);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        this.updateCommands(commandes);
      } else {
        this.emitAddCommandeSubject(false);
      }
    });
  }

  copyCommande(com: Commande, toCom: Commande) {
    toCom.id = com.id;
    toCom.num_com = com.num_com;
    toCom.id_projet = com.id_projet;
    toCom.color = com.color;
    toCom.available = com.available;
  }

  updateCommands(commandes: Commande[]) {
    for (let com of commandes) {
      let res = this.getComById(com.id);
      this.copyCommande(com, res);
    }
    this.emitAddCommandeSubject(true);
    this.emitCommandeSubject();
  }

  projectHaveCommande(numCommande: string, idProjet: string) {
    for (const commande of this.listeCommandes) {
      if (commande.num_com == numCommande) {
        if (commande.id_projet == idProjet) {
          return true;
        }
      }
    }
    return false;
  }

  isProjetInRealisations(listeRealisation: Realisation[], projet: Projet) {
    for (const real of listeRealisation) {
      return (this.projectHaveCommande(real.num_commande, projet.id));
    }
    return false;
  }

  /**
   * récupère un cra précis dans la liste des semaines de cra
   * @param id
   * @param index
   */
  public getComById(id: string): Commande {
    const com = this.listeCommandes.find(
      (com) => com.id === id);
    return com as Commande;
  }

  getAllCommandes() {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommands();
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.listeCommande) {
          this.listeCommandes = reponse.listeCommande;
        }
        this.emitCommandeSubject();
      } else {
        console.log("Erreur: getAllCommandsProjet");
      }
    });
  }
}
