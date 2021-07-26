import {Component, OnInit, ViewChild} from '@angular/core';
import {ConnexionService} from "../../connexion/connexion.service";
import {TableCongesEnAttenteComponent } from "./table-conges-en-attente/table-conges-en-attente.component";

@Component({
  selector: 'app-conges-en-attente',
  templateUrl: './conges-en-attente.component.html',
  styleUrls: ['./conges-en-attente.component.scss']
})
export class CongesEnAttenteComponent implements OnInit {

  @ViewChild(TableCongesEnAttenteComponent ) child: TableCongesEnAttenteComponent | undefined ;
  etat= 'EN_COURS';

  constructor(private c: ConnexionService) { }

  ngOnInit(): void {

  }

}
