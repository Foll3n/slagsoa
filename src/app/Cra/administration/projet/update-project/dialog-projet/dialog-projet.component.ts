import {AfterViewInit, Component, Inject, OnInit, SimpleChanges, ViewChild} from '@angular/core';

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
export class DialogProjetComponent implements AfterViewInit{
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

    // const test:CommandeInsert[] = [];
    // this.dataSource =  new MatTableDataSource(test);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.projet = this.copyProjet(data.projet);



    this.projetService.ajout.subscribe((bool: boolean) => {
      this.isAddProjet = bool;
      setTimeout(() => {
        this.isAddProjet = false;
      }, 3000);
    });

    this.commandeService.commandeSubject.subscribe((commandes: CommandeInsert[]) => {
      this.listeCommandes = commandes;
      this.dataSource =  new MatTableDataSource(this.getCommandeById());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log("test",this.projet.id, this.listeCommandes);
    } );
// récupérer si la commande a bien été ajouté
  }
  private copyProjet(projet: Projet): Projet{
    return new Projet(projet.code_projet, projet.color, projet.id, projet.modeRealisation, projet.available);
  }
  public width(){
    return window.innerWidth;
  }

  revert(){
    this.projet = this.copyProjet(this.data.projet);
    // this.projetService.updateProjet(this.projet);
    this.commandeService.emitCommandeSubject();
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
        let c = new CommandeInsert(com.num_com,com.id_projet,com.id,com.available,com.color);
        res.push(c);
      }
    }
    return res;
  }
  updateProjet(commandes: CommandeInsert[]){
    console.log("projet actuel :", this.projet);
    this.commandeService.updateCommandes(commandes);
    this.projetService.updateProjet(this.projet);

    console.log(commandes);
  }
  displayListNotEmpty(){
    if (this.getCommandeById().length> 0) return true;
    return false;
  }
  putAllCommandsFalse(){
    console.log("ici je test 3",this.projet);
    for(const com of this.dataSource.data){
      this.projet.available=='true'?com.available='false':com.available='true';
      // com.available = this.projet.available;
    }

  }

  ngOnInit(): void {
    this.commandeService.emitCommandeSubject();

    console.log("test on Init");
  }

  ngAfterViewInit(): void {
    this.commandeService.emitCommandeSubject();
  }
}

