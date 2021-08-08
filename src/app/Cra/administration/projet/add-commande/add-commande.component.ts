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
import {resetForm} from "../../../../../environments/environment";
import {Realisation} from '../../../models/realisation/Realisation';


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
  listeProjets!: Projet[];
  listeUsers!:Utilisateur[];
  listeProjetSubscription!: Subscription;
  listeUsersSubscription!:Subscription;
  isAddCom = false;
  isAddRealisation = false;
  commandeProjet!: FormGroup;
  commandeUtilisateur!: FormGroup;

  constructor(private projetService: ProjetService, private httpClient: HttpClient, private userService: UserService) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});


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
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
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
   * ajoute une commande à un projet. On créé la commande grâce aux champs du formulaire
   */
  addCommande(formDirective: FormGroupDirective){
      if(this.commandeProjet){
        let commande = new CommandeInsert(this.commandeProjet.get('codeCommande')?.value, this.commandeProjet.get('projet')?.value , '' , '');
        const commandeHttp = new CommandeHttpDatabase(this.httpClient);
        const response = commandeHttp.addCommande(commande);
        response.subscribe(reponse => {
          if(reponse.status == 'OK'){
            console.log(reponse);
            this.isAddCom = true;
            setTimeout(() => {
              this.isAddCom = false;
            }, 3000);
          }
          else{
            console.log("Erreur de requete de base de données");
            this.isAddCom = false;
          }
        });


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
      console.log("ma réalisation" + realisation.id_com + " " + realisation.id_usr);
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
      const response = commandeHttp.addCommandeUser(realisation);
      response.subscribe(reponse => {
        if(reponse.status == 'OK'){
          console.log(reponse);
          this.isAddRealisation = true;
          setTimeout(() => {
            this.isAddRealisation = false;
          }, 3000);
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
              console.log(reponse);
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
    const response = projetHttp.getAllProjects();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeProjets = reponse.liste_projet;
      }
      else{
        console.log("Erreur de requete de base de données");
      }


    });
  }

}
