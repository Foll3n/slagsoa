import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CommandeInsert} from '../../../models/commande/CommandeInsert';
import {Projet} from '../../../models/projet/Projet';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {CommandeHttpDatabase} from '../../../../configuration-http/CommandeHttpDatabase';
import {ProjetHttpDatabase} from '../../../../configuration-http/ProjetHttpDatabase';
import {ComProjet} from '../../administration-cra/visualisation-projet-com/visualisation-projet-com.component';
import {ProjetService} from '../../../../services/projet.service';
import {CraWeekInsert} from '../../../models/logCra/craWeekInsert';
import {DialogContent} from '../../administration-cra/table-cra-en-attente/table-cra-en-attente.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogProjetComponent} from './dialog-projet/dialog-projet.component';
import {environment} from '../../../../../environments/environment';
import { jsPDF } from "jspdf";
import {Router} from '@angular/router';
import {Responsable} from '../../../models/responsable/responsable';
import {ResponsableService} from '../../../../services/responsable.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  minWidth = environment.minWidth;
  projetSubscription!: Subscription;
  public get width() {
    return window.innerWidth;
  }
  constructor(private httpClient: HttpClient, private projetService: ProjetService, public dialog: MatDialog, private router: Router) {

    this.projetSubscription = this.projetService.projetSubject.subscribe((projets: Projet[]) => {
      this.listeProjets = projets;

      this.dataSource = new MatTableDataSource(this.listeProjets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }

  listeProjets!: Projet[];
  listeCommandes: CommandeInsert[] = [];
  displayedColumns: string[] = ['id', 'code_projet', 'mode_realisation','pdf'];
  dataSource!: MatTableDataSource<Projet>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
  }

  openDialog(projet: Projet): void {
    const dialogRef = this.dialog.open(DialogProjetComponent, {
      width: '550px',
      data: {projet,commandes:[]}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  makePdf(projet:Projet){
    console.log(projet,"projet");
    this.router.navigate(['/generate-pdf'], { queryParams: projet ,  skipLocationChange: true });
  }

  getTarget(id: string){
    return '#target-' + id;
  }
  getLink(id: string){
    return 'target-' + id;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reload(){
    this.projetService.emitProjetSubject();
  }


  ngAfterViewInit() {

  }


}

