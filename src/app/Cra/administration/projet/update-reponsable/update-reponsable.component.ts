import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subscription} from 'rxjs';
import {Responsable} from '../../../models/responsable/responsable';
import {ResponsableService} from '../../../../services/responsable.service';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {checkValidity, resetForm, validateEmail} from '../../../../../environments/environment';
import {ClientService} from '../../../../services/client.service';
import {Client} from '../../../models/client/Client';

@Component({
  selector: 'app-update-reponsable',
  templateUrl: './update-reponsable.component.html',
  styleUrls: ['./update-reponsable.component.scss']
})
export class UpdateReponsableComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'prenom', 'mail','idClient','valider'];
  dataSource!: MatTableDataSource<Responsable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listeresponsables: Responsable[] = [];
  responsableSubscription!: Subscription;
  listeClients: Client[] = [];
  clientSubscription!: Subscription;
  responsableForm!: FormGroup;
  constructor(private responsableService: ResponsableService, private clientService: ClientService) {
    this.responsableForm = new FormGroup({
      nom: new FormControl(),
      prenom: new FormControl(),
      mail: new FormControl(),
      idClient : new FormControl()
    });
    this.responsableSubscription = this.responsableService.responsablesSubject.subscribe((responsable: Responsable[]) =>
    {
      this.listeresponsables = responsable;
      this.dataSource = new MatTableDataSource(this.listeresponsables);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.clientSubscription = this.clientService.clientSubject.subscribe((clients: Client[]) =>
    {
      this.listeClients = clients;
    });
  }
  updateResponsable(responsable: Responsable){
    this.responsableService.updateResponsable(responsable);
  }
  ngOnInit(): void {
    this.clientService.emitClientSubject();
    this.responsableService.emitResponsablesSubject();
  }
  getClientName(responsable: Responsable){
    const client = this.clientService.getClientById(responsable.idClient);
    if (client)
      return client.nomSociete;
    return '';
  }

  validateMail(responsable: Responsable){
    return validateEmail(responsable.mail);
  }
  check(property: string){
    checkValidity(property, this.responsableForm)

  }
  addResponsable(formDirective: FormGroupDirective){
    this.responsableService.addResponsable(new Responsable('', this.responsableForm.get('nom')?.value.trim(),
      this.responsableForm.get('prenom')?.value.trim(),
      this.responsableForm.get('mail')?.value.trim(),
      this.responsableForm.get('idClient')?.value.trim()));

    resetForm(this.responsableForm);
    formDirective.resetForm();
  }
}
