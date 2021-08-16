import {Component, Input, OnInit} from '@angular/core';
import {Projet} from '../../models/projet/Projet';
import {Client} from '../../models/client/Client';
import {Responsable} from '../../models/responsable/responsable';
import {CommandeInsert} from '../../models/commande/CommandeInsert';
import {FormGroupDirective} from '@angular/forms';
import {resetForm, shortMessage} from '../../../../environments/environment';
import {ProjetService} from '../../../services/projet.service';
import {CommandeService} from '../../../services/commande.service';
import {ClientService} from '../../../services/client.service';
import {ResponsableService} from '../../../services/responsable.service';
import {Subscription} from 'rxjs';
import {Message} from '../../models/message';

@Component({
  selector: 'app-slide-recap',
  templateUrl: './slide-recap.component.html',
  styleUrls: ['./slide-recap.component.scss']
})
export class SlideRecapComponent implements OnInit {
  @Input()
  projet!: Projet;
  @Input()
  client!: Client;
  @Input()
  reponsable!: Responsable;
  @Input()
  listeCommandes!: CommandeInsert[];
  clientSubscription!:Subscription;
  responsableSubscription!:Subscription;
  projetSscription!:Subscription;
  valueAdd: Message = new Message('');
  constructor(private projetService: ProjetService, private commmandeService: CommandeService, private clientService: ClientService, private responsableService: ResponsableService) {
    this.projetSscription = this.projetService.projetSubject.subscribe( (projets:Projet[]) => {
      console.log("je recup le bon projet");
      for( const p of projets){
        if (p.code_projet == this.projet.code_projet){
          this.projet.id = p.id;
        }
      }
      this.addCommandes();
    });
    this.projetService.ajout.subscribe(
      (isAdd: boolean) => {
        if(isAdd)
        shortMessage(this.valueAdd,'Super le projet a bien été ajouté');
        else shortMessage(this.valueAdd,'Le projet n\'a pas pu être ajouté');

      });
    this.clientSubscription = this.clientService.clientSubject.subscribe((clients: Client[]) =>
    {
      // this.addResponsable();
      console.log("je recupere au bon endroit les clients", clients);
      for( const c of clients){
        if (c.nomSociete == this.client.nomSociete){

          this.client.idClient = c.idClient;
        }
      }
      let c = clients.find(client => client.nomSociete == this.client.nomSociete)
      this.client = c ? c : this.client;
      this.addResponsable();

    });
    this.responsableSubscription = this.responsableService.responsablesSubject.subscribe( (responsables:Responsable[]) => {
      console.log("je recup le bon responsable");
      for( const r of responsables){
        if (r.idClient == this.reponsable.idClient){
          this.reponsable.idResponsable = r.idResponsable;
        }
      }
      this.addProjet();
    });
  }


  ngOnInit( ): void {
  }
  /**
   * Ajoute un projet grâce au service projetService ce qui permet d'avoir à tous moment la liste des projets
   */
  addProjet(){

    let projet = new Projet(this.projet.code_projet,this.projet.color,'',this.projet.modeRealisation,'true',this.reponsable.idResponsable);
    console.log("addProjet--->", this.projet);
      this.projetService.addProjet(projet);
  }
  /**
   * Ajoute un projet grâce au service projetService ce qui permet d'avoir à tous moment la liste des projets
   */
  addCommandes(){
    console.log("addCommandes-->", this.listeCommandes);

    for (let com of this.listeCommandes){
      let res = new CommandeInsert(com.num_com,this.projet.id,'','true');
      this.commmandeService.addCommande(res);
    }
  }

  addClient(){
    console.log("addClient--->", this.client);

    if (this.client.idClient == ''){
      this.clientService.addClient(this.client)
    }
    else{
      this.clientService.updateClient(this.client);
    }
  }
  addResponsable(){
    console.log("addResponsable--->", this.reponsable);
    this.reponsable.idClient = this.client.idClient;

    if (this.reponsable.idResponsable == ''){
      this.responsableService.addResponsable(this.reponsable)
    }
    else{
      this.responsableService.updateResponsable(this.reponsable);
    }
  }

  addAll(){
    console.log("add ALL");
  this.addClient();

  }

}
