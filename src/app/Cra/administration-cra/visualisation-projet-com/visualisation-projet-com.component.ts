import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Projet} from "../../models/projet/Projet";
import {CommandeHttpDatabase} from "../../../configuration-http/CommandeHttpDatabase";
import {ProjetHttpDatabase} from "../../../configuration-http/ProjetHttpDatabase";
import {HttpClient} from "@angular/common/http";
import {CommandeInsert} from "../../models/commande/CommandeInsert";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";


export interface ComProjet {
  commande: string;
  id_com:string;
  projet: string;
  id_projet:string;
}


@Component({
  selector: 'app-visualisation-projet-com',
  templateUrl: './visualisation-projet-com.component.html',
  styleUrls: ['./visualisation-projet-com.component.scss']
})



export class VisualisationProjetComComponent implements AfterViewInit {
  listeCommandeProjet!: CommandeInsert[];
  listeProjets!:Projet[];
  liste:ComProjet[] = [];
  displayedColumns: string[] = ['projet', 'commande'];
  dataSource!: MatTableDataSource<ComProjet>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private httpClient: HttpClient) {
    this.getListeProjet();


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
   * Récupère la liste des commandes d'un projet
   * @param projet
   */
  getCommandeProjet(projet: Projet){

    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommandsProjet(projet.id);
    response.subscribe(reponse => {
      if (reponse.status =='OK'){
        console.log(reponse);
        this.listeCommandeProjet = reponse.listeCommande;
        if (this.listeCommandeProjet)
        for(let com of this.listeCommandeProjet)
          this.liste.push({commande : com.num_com, id_com:com.id, projet : projet.code_projet, id_projet:projet.id});
        console.log(this.liste);
        this.dataSource = new MatTableDataSource(this.liste);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    const response = projetHttp.getAllProjects();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeProjets = reponse.liste_projet;
        for (let projet of this.listeProjets){
          this.getCommandeProjet(projet);
        }
      }
      else{
        console.log("Erreur de requete de base de données");
      }


    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

}
