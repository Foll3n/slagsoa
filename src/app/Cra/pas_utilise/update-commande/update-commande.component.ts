import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Commande} from "../../models/commande/Commande";
import {Projet} from "../../models/projet/Projet";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {CommandeService} from "../../../services/commande.service";
import {ProjetService} from "../../../services/projet.service";
import {CraWeekInsert} from "../../models/logCra/craWeekInsert";

@Component({
  selector: 'app-update-commande',
  templateUrl: './update-commande.component.html',
  styleUrls: ['./update-commande.component.scss']
})
export class UpdateCommandeComponent implements OnChanges {
  @Input()
  projet!:Projet;
  display = false;
  isAddCom = false;
  isAddProjet = false;
  choice = ['forfait','regie'];
  listeCommandes!:Commande[];
  commandesSubject!:Subscription;
  displayedColumns: string[] = ['num_com'];
  commandeSubscription!: Subscription;
  dataSource!: MatTableDataSource<Commande>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() emitter: EventEmitter<string> = new EventEmitter();

  constructor(public commandeService: CommandeService, private projetService: ProjetService) {

    this.projetService.ajout.subscribe((bool:boolean)=>{
      this.isAddProjet = bool;
      setTimeout(() => {
        this.isAddProjet = false;
      }, 3000);
    });
    this.commandeSubscription = this.commandeService.commandeSubject.subscribe((commandes:Commande[]) =>{
      this.listeCommandes = commandes;
      this.dataSource =  new MatTableDataSource(this.getCommandeById());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } );

  }
  public width(){
    return window.innerWidth;
  }


  revert(){
    this.listeCommandes = [];
    this.display = false;
    console.log("revert");
    this.emitter.emit("reload");
    this.commandeService.emitCommandeSubject();
    this.chargementTable();
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
        let c = new Commande(com.num_com,com.id_projet,com.id,com.available,com.color);
        res.push(c);
      }
    }
    return res;
  }
  updateProjet(commandes: Commande[]){
    this.commandeService.updateCommandes(commandes);
    this.projetService.updateProjet(this.projet);

    console.log(commandes);
  }
  displayListNotEmpty(){
    if (this.getCommandeById().length> 0) return true;
    return false;
  }
  ngOnChanges(changes: SimpleChanges): void {

    // console.log("test avant",this.projet.id);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.commandeService.emitCommandeSubject();
    this.display = true;
  }
}
