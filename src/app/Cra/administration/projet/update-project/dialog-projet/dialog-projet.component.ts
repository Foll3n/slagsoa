import {Component, Inject, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CommandeInsert} from '../../../../models/commande/CommandeInsert';
import {Projet} from '../../../../models/projet/Projet';
import {MatTableDataSource} from '@angular/material/table';
import {CommandeService} from '../../../../../services/commande.service';
import {ProjetService} from '../../../../../services/projet.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';


export interface DialogData {
  projet: Projet;
}

@Component({
  selector: 'dialog-projetComponent',
  templateUrl: './dialog-projet.component.html',
  styleUrls: ['./dialog-projet.component.scss']
})
export class DialogProjetComponent implements OnInit{
  projet!: Projet;
  isAddCom = false;
  isAddProjet = false;
  choice = ['forfait','regie'];
  listeCommandes!: CommandeInsert[];
  commandesSubject!: Subscription;
  displayedColumns: string[] = ['num_com', 'checked'];
  dataSource!: MatTableDataSource<CommandeInsert>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public commandeService: CommandeService, private projetService: ProjetService,
    public dialogRef: MatDialogRef<DialogProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.projet = this.copyProjet(data.projet);

    console.log(this.projet,"iciiiiiiiiiii");

    this.projetService.ajout.subscribe((bool: boolean) => {
      this.isAddProjet = bool;
      setTimeout(() => {
        this.isAddProjet = false;
      }, 3000);
    });

    this.commandeService.commandeSubject.subscribe((commandes: CommandeInsert[]) => {
      this.listeCommandes = commandes;
      console.log('je reçois' , this.projet, '------------: ', this.getCommandeById());
      this.dataSource =  new MatTableDataSource(this.getCommandeById());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("test",this.projet.id, this.listeCommandes);
    } );
// récupérer si la commande a bien été ajouté
  }
  private copyProjet(projet: Projet): Projet{
    return new Projet(projet.code_projet, projet.color, projet.id, projet.modeRealisation);
  }
  public width(){
    return window.innerWidth;
  }

  revert(){
    this.projet = this.copyProjet(this.data.projet);
    this.projetService.updateProjet(this.projet);
    // this.commandeService.emitCommandeSubject();
  }
  chargementTable(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getCommandeById(){
    let res = [];
    if(!this.projet)return [];
    for (let com of this.listeCommandes){
      if(com.id_projet == this.projet.id){
        let c = new CommandeInsert(com.num_com,com.id_projet,com.id,com.color);
        res.push(c);
      }
    }
    return res;
  }
  updateProjet(commandes: CommandeInsert[]){
    this.commandeService.updateCommandes(commandes);
    this.projetService.updateProjet(this.projet);

    console.log(commandes);
  }
  displayListNotEmpty(){
    if (this.getCommandeById().length> 0) return true;
    return false;
  }


  ngOnInit(): void {
    this.commandeService.emitCommandeSubject();
    console.log("test on Init");
  }
}

