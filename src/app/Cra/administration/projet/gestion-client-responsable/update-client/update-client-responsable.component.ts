import {Component, OnInit, ViewChild} from '@angular/core';
import {Client} from '../../../../models/client/Client';
import {Subscription} from 'rxjs';
import {ClientService} from '../../../../../services/client.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {checkValidity, resetForm, validateEmail} from '../../../../../../environments/environment';

@Component({
  selector: 'app-update-client-responsable',
  templateUrl: './update-client-responsable.component.html',
  styleUrls: ['./update-client-responsable.component.scss']
})
/**
 * Gestion des clients
 */
export class UpdateClientResponsableComponent implements OnInit {
  displayedColumns: string[] = ['nomSociete', 'adresse', 'mail', 'siret', 'valider'];
  dataSource!: MatTableDataSource<Client>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  listeClients!: Client[];
  clientSubscription!: Subscription;
  clientForm!: FormGroup;
  isAdd = false;
  checkUpdate = false;

  constructor(private clientService: ClientService) {
    this.clientForm = new FormGroup({
      mail: new FormControl(),
      adresse: new FormControl(),
      siret: new FormControl(),
      nomSociete: new FormControl()
    });
    this.clientSubscription = this.clientService.clientSubject.subscribe((clients: Client[]) => {
      if (this.checkUpdate) {
        this.isAdd = true;
        setTimeout(() => {
          this.isAdd = false;
        }, 2000);
      }

      this.listeClients = clients;
      this.dataSource = new MatTableDataSource(this.listeClients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * mise à jour d'un client
   * @param client
   */
  updateClient(client: Client) {
    this.checkUpdate = true;
    this.clientService.updateClient(client);
  }

  ngOnInit(): void {
  }

  /**
   * check que le mail soit valide
   * @param client
   */
  validateMail(client: Client) {
    return validateEmail(client.mail);
  }

  /**
   * check si la propriété du formulaire est valide ou non
   * @param property
   */
  check(property: string) {
    checkValidity(property, this.clientForm);

  }

  /**
   * ajoute un client
   * @param formDirective
   */
  addClient(formDirective: FormGroupDirective) {
    this.checkUpdate = true;
    this.clientService.addClient(new Client('', this.clientForm.get('nomSociete')?.value,
      this.clientForm.get('adresse')?.value,
      this.clientForm.get('mail')?.value,
      this.clientForm.get('siret')?.value));

    resetForm(this.clientForm);
    formDirective.resetForm();
  }
}
