import {Component, OnInit, ViewChild} from '@angular/core';
import {ConnexionService} from "../../connexion/connexion.service";
import {TableCongesEnAttenteComponent } from "./table-conges-en-attente/table-conges-en-attente.component";
import {TypesHttpService} from "../../configuration-http/types-http.service";
import {EtatHttpService} from "../../configuration-http/etat-http.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-conges-en-attente',
  templateUrl: './conges-en-attente.component.html',
  styleUrls: ['./conges-en-attente.component.scss']
})
export class CongesEnAttenteComponent implements OnInit {

  @ViewChild(TableCongesEnAttenteComponent) child: TableCongesEnAttenteComponent | undefined;
  etat = '';
  etats = [];
  constructor(public c: ConnexionService, private etatHttpService: EtatHttpService) {
  }

  ngOnInit(): void {
    this.c.testLogin();
    if(this.c.isLogged()){
      this.etat = "EN_COURS";
      this.getTypes();
    }
  }

  getTypes()
  {
    this.etatHttpService.getTypes().subscribe(
      resultat=> {
        console.log(resultat);
        for(let i of resultat.outputEtat){
          // @ts-ignore
          this.etats.push(i.nom);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  changerEtatTableau() {
    this.child?.recuperationConge(this.etat);
  }
}
