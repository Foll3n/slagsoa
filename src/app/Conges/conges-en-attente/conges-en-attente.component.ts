import { Component, OnInit } from '@angular/core';
import {ConnexionService} from "../../connexion/connexion.service";

@Component({
  selector: 'app-conges-en-attente',
  templateUrl: './conges-en-attente.component.html',
  styleUrls: ['./conges-en-attente.component.scss']
})
export class CongesEnAttenteComponent implements OnInit {

  constructor(private c: ConnexionService) { }

  ngOnInit(): void {

  }

}
