import { Component, OnInit } from '@angular/core';
import {Projet} from '../../../models/projet/Projet';
import {Subscription} from 'rxjs';
import {ProjetService} from '../../../../services/projet.service';
import {Commande} from '../../../models/commande/Commande';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {CommandeHttpDatabase} from '../../../../configuration-http/CommandeHttpDatabase';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProjetHttpDatabase} from '../../../../configuration-http/ProjetHttpDatabase';
import {Utilisateur} from "../../../../Modeles/utilisateur";
import {UserService} from "../../../../services/user.service";
import {environment, resetForm, shortMessage} from '../../../../../environments/environment';
import {CommandeService} from '../../../../services/commande.service';
import {Message} from '../../../models/message';
import {CraService} from '../../../../services/cra.service';


@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.scss']
})
/**
 * Composant d'ajout de commande à un projet ou a un utilisateur qui fait partie des pages administration
 */
export class AddCommandeComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders()
  };
  listeCommandeProjet: Commande[] = [];
  listeProjets: Projet[]= [];

  listeUsers!:Utilisateur[];
  listeProjetSubscription!: Subscription;
  listeUsersSubscription!:Subscription;
  selectedProjet!:Projet;
  commandeAdd:Message = new Message('');
  lengthComNum = environment.lengthComNum
  isAddRealisation = false;
  commandeProjet!: FormGroup;
  commandeUtilisateur!: FormGroup;


  constructor(private craService: CraService,private projetService: ProjetService, private httpClient: HttpClient, private userService: UserService, private commandeService: CommandeService) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeUtilisateur = new FormGroup({
      projet: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetAvailableSubject.subscribe(
      (projets: Projet[]) => {
        this.listeProjets = projets;
      });
    this.listeUsersSubscription = this.userService.usersSubject.subscribe(
      (users: Utilisateur[]) => {
        this.listeUsers = users;
      });

  }

  /**
   * retourne la taile de l'écran
   */
  public get width() {
    return window.innerWidth;
  }

  /**
   * récupère les commandes d'un projet
   */
  getCommandesProjet(){
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const rep = commandeHttp.getAllCommandsProjet(this.commandeProjet.get('projet')?.value);
    rep.subscribe(reponse => {
      if (reponse.status =='OK'){
        this.listeCommandeProjet = [];
        if(reponse.listeCommande)
          this.listeCommandeProjet = reponse.listeCommande;
      }
      else{
        console.log("Erreur: getAllCommandesProjet");
      }

    });
  }

  /**
   * ajoute une commande à un projet. On créé la commande grâce aux champs du formulaire
   */
  addCommande(formDirective: FormGroupDirective) {
    if (this.commandeProjet) {
      const commande = new Commande(this.commandeProjet.get('codeCommande')?.value, this.commandeProjet.get('projet')?.value, '', 'true','');

      if (this.listeCommandeProjet && this.listeCommandeProjet.find(c => c.num_com === commande.num_com)) {
        shortMessage(this.commandeAdd,'Commande déja présente');
      } else {
        const commandeHttp = new CommandeHttpDatabase(this.httpClient);
        const response = commandeHttp.addCommande(commande);
        response.subscribe(reponse => {
          if (reponse.status === 'OK') {
            shortMessage(this.commandeAdd,'Commande ajoutée');

          } else {
            shortMessage(this.commandeAdd,'Erreur de base de données');
          }
        });
      }
      resetForm(this.commandeProjet);
      formDirective.resetForm();
    }
  }

  setComUser(map: Map<string, Utilisateur[]>){
    console.log("map -> ", map);

  }


  /**
   * Récupère la liste des commandes d'un projet
   * @param projet
   */
  getCommandeProjetUser(projet: Projet){
    this.selectedProjet = projet;
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
          const rep = commandeHttp.getAllCommandsProjet(projet.id);
          rep.subscribe(reponse => {
            if (reponse.status =='OK'){
              this.listeCommandeProjet = [];
              if(reponse.listeCommande)
                this.listeCommandeProjet = reponse.listeCommande;
              }
            else{
              console.log("Erreur: getAllCommandesProjet");
            }

          });
        }

  /**
   * Récupère la liste de tous les projets et la met dans listeProjets (pas utilisé car on est abonné au projetService qui contient toujours la liste des projets à jour
    */
  getListeProjet(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllProjectsAvailable();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        this.listeProjets = reponse.liste_projet;
      }
      else{
        console.log("Erreur de requete de base de données");
      }
    });
  }
}
