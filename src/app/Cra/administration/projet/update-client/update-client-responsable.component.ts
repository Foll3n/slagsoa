import {Component, OnInit, ViewChild} from '@angular/core';
import {Client} from '../../../models/client/Client';
import {Subscription} from 'rxjs';
import {ClientService} from '../../../../services/client.service';
import {MatTableDataSource} from '@angular/material/table';
import {Projet} from '../../../models/projet/Projet';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {checkValidity, resetForm, validateEmail} from '../../../../../environments/environment';
import {Responsable} from '../../../models/responsable/responsable';

@Component({
  selector: 'app-update-client-responsable',
  templateUrl: './update-client-responsable.component.html',
  styleUrls: ['./update-client-responsable.component.scss']
})
export class UpdateClientResponsableComponent implements OnInit {
  displayedColumns: string[] = ['nomSociete', 'adresse', 'mail','siret','valider'];
  dataSource!: MatTableDataSource<Client>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listeClients!: Client[];
  clientSubscription!: Subscription;
  clientForm!: FormGroup;
  constructor(private clientService: ClientService) {
    this.clientForm = new FormGroup({
      mail: new FormControl(),
      adresse: new FormControl(),
      siret: new FormControl(),
      nomSociete : new FormControl()
    });
    this.clientSubscription = this.clientService.clientSubject.subscribe((clients:Client[]) =>
    {
      this.listeClients = clients;
      this.dataSource = new MatTableDataSource(this.listeClients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  updateClient(client: Client){
    this.clientService.updateClient(client);
  }
  ngOnInit(): void {
  }
  validateMail(client: Client){
    return validateEmail(client.mail);
  }
  check(property: string){
    checkValidity(property, this.clientForm);

  }
addClient(formDirective: FormGroupDirective){
    this.clientService.addClient(new Client('', this.clientForm.get('nomSociete')?.value,
      this.clientForm.get('adresse')?.value,
      this.clientForm.get('mail')?.value,
  this.clientForm.get('siret')?.value));

  resetForm(this.clientForm);
    formDirective.resetForm();
}
}
