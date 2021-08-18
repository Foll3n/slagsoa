import { Component, OnInit } from '@angular/core';
import {Projet} from '../../../models/projet/Projet';
import {Subscription} from 'rxjs';
import {ProjetService} from '../../../../services/projet.service';
import {CommandeInsert} from '../../../models/commande/CommandeInsert';
import {RealisationPost} from '../../../models/realisation/RealisationPost';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {CommandeHttpDatabase} from '../../../../configuration-http/CommandeHttpDatabase';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProjetHttpDatabase} from '../../../../configuration-http/ProjetHttpDatabase';
import {Utilisateur} from "../../../../Modeles/utilisateur";
import {UserService} from "../../../../services/user.service";
import {resetForm, shortMessage} from '../../../../../environments/environment';
import {Realisation} from '../../../models/realisation/Realisation';
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
  listeCommandeProjet!: CommandeInsert[];
  listeProjets: Projet[]= [];

  listeUsers!:Utilisateur[];
  listeProjetSubscription!: Subscription;
  listeUsersSubscription!:Subscription;

  commandeAdd:Message = new Message('');

  isAddCom = false;
  isAddRealisation = false;
  commandeProjet!: FormGroup;
  commandeUtilisateur!: FormGroup;

  constructor(private craService: CraService,private projetService: ProjetService, private httpClient: HttpClient, private userService: UserService, private commandeService: CommandeService) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});

    // this.commandeService.commandeSubject.subscribe((commandes: CommandeInsert[]) => this.listeCommandes = commandes );
    //Création des différents formulaires nécessaires
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeProjet = new FormGroup({
      codeCommande: new FormControl(),
      projet: new FormControl(),
    });
    this.commandeUtilisateur = new FormGroup({
      commande: new FormControl(),
      projet: new FormControl(),
      utilisateur: new FormControl()
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
      const commande = new CommandeInsert(this.commandeProjet.get('codeCommande')?.value, this.commandeProjet.get('projet')?.value, '', 'true','');

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
      // this.commandeProjet.clearValidators();
      resetForm(this.commandeProjet);
      formDirective.resetForm();
    }

  }


  /**
   * Ajoute une commande à un utilisateur à l'aide du formulaire
   */
  addRealisation(formDirective: FormGroupDirective){
    if(this.commandeUtilisateur){
      let realisation = new RealisationPost(this.commandeUtilisateur.get('utilisateur')?.value, this.commandeUtilisateur.get('commande')?.value,  `${sessionStorage.getItem('id')}`);
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
      const response = commandeHttp.addCommandeUser(realisation);
      response.subscribe(reponse => {
        if(reponse.status == 'OK'){
          this.isAddRealisation = true;
          setTimeout(() => {
            this.isAddRealisation = false;
          }, 3000);
          this.userService.refreshRealisationsUser();
          // this.craService.ini
        }
        else{
          console.log("Erreur de requete de base de données");
          this.isAddRealisation = false;
        }


      });
      resetForm(this.commandeUtilisateur);
      formDirective.resetForm();
      // this.commandeUtilisateur.reset();
    }
}

  /**
   * Récupère la liste des commandes d'un projet
   * @param projet
   */
  getCommandeProjetUser(projet: Projet){
    if(this.commandeUtilisateur.get('utilisateur')?.value){
      let realisations: Realisation[] = [];
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
      const response = commandeHttp.getAllCommandsUser(this.commandeUtilisateur.get('utilisateur')?.value);
      response.subscribe(reponse => {
        if (reponse.status == 'OK'){
          if (reponse.realisations)
          realisations = reponse.realisations;
          else realisations = [];
          const rep = commandeHttp.getAllCommandsProjet(projet.id);
          rep.subscribe(reponse => {
            if (reponse.status =='OK'){
              this.listeCommandeProjet = [];
              if(reponse.listeCommande)
              for (const com of reponse.listeCommande){
                if (!realisations.find(elem => elem.id === com.id)){
                  this.listeCommandeProjet.push(com);
                }
              }
            }
            else{
              console.log("Erreur: getAllCommandesProjet");
            }

          });
        }
        else{
          console.log("Erreur : getAllCommandsUser");
        }

      });
    }


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
