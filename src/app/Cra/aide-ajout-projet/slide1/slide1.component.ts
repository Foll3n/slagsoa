import {Component, OnInit, Output} from '@angular/core';
import {Client} from '../../models/client/Client';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {ClientService} from '../../../services/client.service';
import {MatTableDataSource} from '@angular/material/table';
import {resetForm} from '../../../../environments/environment';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-slide1',
  templateUrl: './slide1.component.html',
  styleUrls: ['./slide1.component.scss']
})
export class Slide1Component implements OnInit {
  @Output() eventItem = new EventEmitter<Client>();
  listeClients!: Client[];
  clientSubscription!: Subscription;
  clientForm!: FormGroup;
  societeNom: string = '';
  tempClient: Client | undefined = undefined;
  selectedClient: Client | undefined = undefined;

  constructor(private clientService: ClientService) {

    this.clientForm = new FormGroup({
      mail: new FormControl(),
      adresse: new FormControl(),
      siret: new FormControl(),
      nomSociete : new FormControl()
    });
    this.clientSubscription = this.clientService.clientSubject.subscribe((clients: Client[]) =>
    {
      console.log("je recupere");
      this.listeClients = clients;
    });
  }
  updateClient(client: Client){
    this.clientForm.patchValue({
      mail: client.mail,
      adresse: client.adresse,
      siret: client.siret,
      nomSociete : client.nomSociete
    });
    this.selectedClient = client;
  }
  ngOnInit(): void {
    this.clientService.emitClientSubject();
    console.log("updateClient ");
  }
  applyClient(){
    // tslint:disable-next-line:no-non-null-assertion
    this.updateClient(this.tempClient!);
    // this.tempClient = undefined;
  }
  sendClient(){
    console.log("je passe meme pas laaa");
    const client = new Client(this.selectedClient ? this.selectedClient.idClient : '', this.clientForm.get('nomSociete')?.value,
      this.clientForm.get('adresse')?.value,
      this.clientForm.get('mail')?.value,
      this.clientForm.get('siret')?.value);

    // resetForm(this.clientForm);
    console.log("je suis dans le fils j'envoie ",client,"au pere");
    this.eventItem.emit(client);
  }
  searchTerm(){
    this.selectedClient = undefined;
    this.tempClient = this.listeClients.find(c => this.societeNom.length > 1 && c.nomSociete.toLowerCase().includes(this.societeNom.toLowerCase()));
    console.log(this.tempClient);
  }
}
