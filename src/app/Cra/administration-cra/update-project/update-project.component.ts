import {Component, OnInit, ViewChild} from '@angular/core';
import {CommandeInsert} from "../../models/commande/CommandeInsert";
import {Projet} from "../../models/projet/Projet";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {CommandeHttpDatabase} from "../../../configuration-http/CommandeHttpDatabase";
import {ProjetHttpDatabase} from "../../../configuration-http/ProjetHttpDatabase";
import {ComProjet} from "../visualisation-projet-com/visualisation-projet-com.component";
import {UpdateCommandeComponent} from "../update-commande/update-commande.component";
import {ProjetService} from "../../../services/projet.service";

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {

  ngOnInit(): void {
  }

  listeProjets!:Projet[];
  listeCommandes:CommandeInsert[] = [];
  displayedColumns: string[] = ['id', 'code_projet', 'mode_realisation'];
  currentProjet!:Projet;
  dataSource!: MatTableDataSource<Projet>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(UpdateCommandeComponent) child!: UpdateCommandeComponent;
  constructor(private httpClient: HttpClient, private projetService: ProjetService) {
    this.projetService.projetSubject.subscribe((projets:Projet[])=>{
      this.listeProjets = (projets);

      this.dataSource = new MatTableDataSource(this.listeProjets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }
  setProjet(projet:Projet){
    console.log("ooo :",projet);
    let copy = new Projet(projet.code_projet, projet.color,projet.id,projet.modeRealisation);
    this.currentProjet = copy;
  }
  getTarget(id: string){
    return "#target-"+id;
  }
  getLink(id: string){
    return "target-"+id;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reload(){
    this.projetService.emitProjetSubject();
  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


}
