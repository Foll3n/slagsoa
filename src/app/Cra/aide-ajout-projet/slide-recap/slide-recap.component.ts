import {Component, Input, OnInit} from '@angular/core';
import {Projet} from '../../models/projet/Projet';
import {Client} from '../../models/client/Client';
import {Responsable} from '../../models/responsable/responsable';

@Component({
  selector: 'app-slide-recap',
  templateUrl: './slide-recap.component.html',
  styleUrls: ['./slide-recap.component.scss']
})
export class SlideRecapComponent implements OnInit {
  @Input()
  projet!: Projet;
  @Input()
  client!: Client;
  @Input()
  reponsable!: Responsable;
  constructor() { }

  ngOnInit(): void {
  }

}
