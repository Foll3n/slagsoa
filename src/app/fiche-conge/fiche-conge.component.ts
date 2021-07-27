import { Component, OnInit, Input } from '@angular/core';
import {Conge} from "../Modeles/conge";

@Component({
  selector: 'app-fiche-conge',
  templateUrl: './fiche-conge.component.html',
  styleUrls: ['./fiche-conge.component.scss']
})
export class FicheCongeComponent implements OnInit {

  @Input() conge!: Conge;

  constructor() { }

  ngOnInit(): void {
  }

}
