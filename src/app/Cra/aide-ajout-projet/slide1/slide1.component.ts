import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {Client} from '../../models/client/Client';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {ClientService} from '../../../services/client.service';
import {MatTableDataSource} from '@angular/material/table';
import {checkValidity, environment, resetForm} from '../../../../environments/environment';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-slide1',
  templateUrl: './slide1.component.html',
  styleUrls: ['./slide1.component.scss']
})
export class Slide1Component implements OnInit {
  @Output() eventItem = new EventEmitter<Client>();
  isFocus = false;
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
      this.listeClients = clients;
    });
  }
  check(property: string){
    checkValidity(property, this.clientForm)

  }

  /**
   * met à jour le formulaire
    * @param client
   */
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
  }
  applyClient(){
    // tslint:disable-next-line:no-non-null-assertion
    this.updateClient(this.tempClient!);
    // this.tempClient = undefined;
  }
  sendClient(){
    const client = new Client(this.selectedClient ? this.selectedClient.idClient : '', this.clientForm.get('nomSociete')?.value.trim(),
      this.clientForm.get('adresse')?.value.trim(),
      this.clientForm.get('mail')?.value.trim(),
      this.clientForm.get('siret')?.value.trim());

    // resetForm(this.clientForm);
    this.eventItem.emit(client);
  }
  searchTerm(){
    this.selectedClient = undefined;
    this.tempClient = this.listeClients.find(c => this.societeNom.length > 1 && c.nomSociete.trim().toLowerCase().includes(this.societeNom.trim().toLowerCase()));
    console.log(this.tempClient);
  }
  checkClientNotIdentic(){
    let c =  this.listeClients.find(c => c.nomSociete == this.clientForm.get('nomSociete')?.value.trim()) ;
    if (!c){
      return true;
    }
    if (c && this.selectedClient != undefined){
      return true
    }
    return false;
  }
}
