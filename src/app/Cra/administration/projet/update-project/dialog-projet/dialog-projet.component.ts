import {AfterViewInit, Component, Inject, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Commande} from '../../../../models/commande/Commande';
import {Projet} from '../../../../models/projet/Projet';
import {MatTableDataSource} from '@angular/material/table';
import {CommandeService} from '../../../../../services/commande.service';
import {ProjetService} from '../../../../../services/projet.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Responsable} from '../../../../models/responsable/responsable';
import {ResponsableService} from '../../../../../services/responsable.service';
import {UserService} from '../../../../../services/user.service';
import {environment} from '../../../../../../environments/environment';


export interface DialogData {
  projet: Projet;
}

@Component({
  selector: 'app-dialog-projet',
  templateUrl: './dialog-projet.component.html',
  styleUrls: ['./dialog-projet.component.scss']
})
/**
 * composant dialog qui permet de modifier un projet et ses commandes associées
 */
export class DialogProjetComponent implements AfterViewInit{
  projet!: Projet;
  isAddCom = false;
  choice = ['forfait','regie'];
  listeCommandes!: Commande[];
  commandesSubject!: Subscription;
  listeResponsables: Responsable[] = [];
  displayedColumns: string[] = ['num_com', 'checked'];
  dataSource!: MatTableDataSource<Commande>;
  responsableSubsciption!: Subscription;
  ajoutSubscription!: Subscription;
  commandeSubscription!: Subscription;
  message='';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private userService: UserService,
    public commandeService: CommandeService, private projetService: ProjetService,
    private responsableService: ResponsableService,
    public dialogRef: MatDialogRef<DialogProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    const test:Commande[] = [];
    this.dataSource =  new MatTableDataSource(test);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.projet = this.copyProjet(data.projet);

    this.responsableSubsciption = this.responsableService.responsablesSubject.subscribe((responsables: Responsable[]) => {
      this.listeResponsables = responsables.filter(resp => resp.idClient == this.responsableService.getresponsable(this.projet.responsable)?.idClient);
    });

    this.ajoutSubscription = this.projetService.ajout.subscribe((bool: boolean) => {
      if(bool) this.displayMessage('projet mis à jour');
      else this.displayMessage('projet non ajouté');


    });

    this.commandeSubscription = this.commandeService.commandeSubject.subscribe((commandes: Commande[]) => {
      this.listeCommandes = commandes;
      this.dataSource =  new MatTableDataSource(this.getCommandeById());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } );
// récupérer si la commande a bien été ajouté
  }
  private displayMessage(message: string){
    this.message = message;
    setTimeout(() => {
      this.message ='';
    }, 3000);

  }
  /**
   * copie un projet
   * @param projet
   * @private
   */
  private copyProjet(projet: Projet): Projet{
    return new Projet(projet.code_projet, projet.color, projet.id, projet.modeRealisation, projet.available,projet.responsable); ////////////////////////////////////////////////////////////////////////////////////////
  }

  /**
   * retourne la taille de l'écran
   */
  public width(){
    return window.innerWidth;
  }

  /**
   * annule les changement sur un projet
   */
  revert(){
    this.projet = this.copyProjet(this.data.projet);
    // this.projetService.updateProjet(this.projet);
    this.commandeService.emitCommandeSubject();
  }

  /**
   * récupère la commande avec son id
    */
  getCommandeById(){
    let res = [];
    if(!this.projet)return [];
    for (let com of this.listeCommandes){
      if(com.id_projet == this.projet.id){
        let c = new Commande(com.num_com,com.id_projet,com.id,com.available,com.color);
        res.push(c);
      }
    }
    return res;
  }

  /**
   * met un projet à jour avec ses commandes
    * @param commandes
   */
  updateProjet(commandes: Commande[]){
    if(this.projet.code_projet.length >= environment.lengthProjetCode){
      let checkCom = true;
      for(let com of commandes){
        if(com.num_com.length < environment.lengthComNum){
          checkCom = false;
        }
      }
      if(checkCom){
        this.commandeService.updateCommandes(commandes);
        this.projetService.updateProjet(this.projet);
      }
      else{
        this.displayMessage('Le non de la commande doit comporter au moins '+environment.lengthComNum + " caractères");
      }

    }
    else{
      this.displayMessage('Le non du projet doit au moins faire '+environment.lengthProjetCode + " caractères");
    }

  }

  /**
   * check s'il y a une commande associées au projet sélectionné
   */
  displayListNotEmpty(){
    if (this.getCommandeById().length> 0) return true;
    return false;
  }

  /**
   * met toutes les commandes à false
   */
  putAllCommandsFalse(){
    for(const com of this.dataSource.data){
      this.projet.available=='true'?com.available='false':com.available='true';
    }

  }

  ngOnInit(): void {
    this.commandeService.emitCommandeSubject();
    this.responsableService.emitResponsablesSubject();

  }

  ngAfterViewInit(): void {
    this.commandeService.emitCommandeSubject();
  }
}

