import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Commande} from '../../../models/commande/Commande';
import {Projet} from '../../../models/projet/Projet';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {ProjetService} from '../../../../services/projet.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogProjetComponent} from './dialog-projet/dialog-projet.component';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  listeProjets!: Projet[];
  listeCommandes: Commande[] = [];
  displayedColumns: string[] = ['id', 'code_projet', 'mode_realisation', 'pdf', 'graph-com', 'graph-user'];
  dataSource!: MatTableDataSource<Projet>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  minWidth = environment.minWidth;
  projetSubscription!: Subscription;
  indexGraph = 0;
  selectedProjet!: string;

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

  ngOnInit(): void {
  }

  /**
   * ouvrir le dialog qui permettra de modifier le projet
   * @param projet
   */
  openDialog(projet: Projet): void {
    const dialogRef = this.dialog.open(DialogProjetComponent, {
      width: '550px',
      data: {projet, commandes: []}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  /**
   * affiche le graphique donné
   * @param projet
   * @param index
   */
  displayGraph(projet: Projet, index: number) {
    this.indexGraph = index;
    this.selectedProjet = projet.code_projet;
  }

  /**
   * lance la partie génération de pdf
   * @param projet
   */
  makePdf(projet: Projet) {
    console.log(projet, 'projet');
    this.router.navigate(['/generate-pdf'], {queryParams: projet, skipLocationChange: true});
  }

  getTarget(id: string) {
    return '#target-' + id;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {

  }


}

