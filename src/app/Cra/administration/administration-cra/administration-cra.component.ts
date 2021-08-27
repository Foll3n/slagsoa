import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CraWeekInsert} from '../../models/logCra/craWeekInsert';
import {CraHttpDatabase} from '../../../configuration-http/CraHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Cra} from '../../models/cra/Cra';
import {CraWeek} from '../../models/cra/craWeek';
import {InsertCra} from '../../models/cra/InsertCra';
import {CompteRendu} from '../../models/compteRendu/CompteRendu';
import {CraWaitingService} from '../../../services/craWaiting.service';
import {Subscription} from 'rxjs';
import {CommandeHttpDatabase} from '../../../configuration-http/CommandeHttpDatabase';


@Component({
  selector: 'app-administration-cra',
  templateUrl: './administration-cra.component.html',
  styleUrls: ['./administration-cra.component.scss']
})
/**
 * Administration des comptes rendus d'activité page sur laquelle on peut voir les comptes rendus en attente de validations et ceux validés
 */
export class AdministrationCraComponent implements OnInit {

  listeCraWaiting: CraWeekInsert[] = [];
  listeCraValidate: CraWeekInsert[] = [];
  actualWeek!: CraWeek | undefined;
  listeCraSubscription!: Subscription;
  displayTables = [false, false];


  constructor(private httpClient: HttpClient, public craWaitingService: CraWaitingService) {
  }

  ngOnInit(): void {
    this.listeCraSubscription = this.craWaitingService.waitingSubject.subscribe(
      (craWeek: CraWeekInsert[]) => {
        this.listeCraWaiting = craWeek;

      });
    this.listeCraSubscription = this.craWaitingService.validateSubject.subscribe(
      (craWeek: CraWeekInsert[]) => {
        this.listeCraValidate = craWeek;
      });
  }

  /**
   * consulter un compte rendu d'activité qui nous a été envoyé par le fils
   * @param cra
   */
  consulter(cra: CraWeekInsert) {
    // this.craService.initialisation(new Date(cra.dateStart), true);
    this.actualWeek = new CraWeek(0, new Date(cra.dateStart));
    this.actualWeek.status = cra.status;
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const res = commandeHttp.getDistinctCommandsWeek(cra, cra.idUsr);
    res.subscribe(listeCom => {
      this.actualWeek!.listeCommandesWeek = listeCom.listeCommande;
    });

    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getCra(cra.dateStart, cra.dateEnd, cra.idUsr);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        this.transform(reponse.liste_cra);
      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * transformation du cra
   * @param liste_cra
   */
  public transform(liste_cra: InsertCra[]): void {
    // tslint:disable-next-line:no-non-null-assertion
    this.actualWeek!.listeCra = [];
    for (const cra of liste_cra) {

      const id = +cra.id_cra;
      const idUsr = +cra.id_usr;
      const duree = +cra.duree_totale;
      const status = +cra.statusConge;
      const listCr = [];
      if (cra.listeCr != null) {
        for (const sp of cra.listeCr) {
          listCr.push(new CompteRendu(id, sp.id_commande, +sp.duree, sp.color));
        }
      }
      this.actualWeek!.listeCra.push(new Cra(id, idUsr, new Date(cra.date), duree, status, listCr));
    }

  }

  /**
   * Fonction qui a vocation d'être supprimé qui permet de trier les cra par date du plus récent au plus ancien
   * @param liste
   */
  sortList(liste: CraWeekInsert[]) {

    if (!liste) {
      return [];
    }

    const sortedArray: CraWeekInsert[] = liste.sort((obj1, obj2) => {
      if (obj1.dateStart < obj2.dateStart) {
        return 1;
      } else {
        return -1;
      }
      return 0;
    });
    return sortedArray;
  }
}
