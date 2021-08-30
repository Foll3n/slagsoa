import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './Facture/visualisation/visualisation.component';
import { AjouterComponent } from './Facture/ajouter/ajouter.component';
import { UtilisateursComponent } from "./Parametres/utilisateurs/utilisateurs.component";
import {VisualisationCongesComponent} from "./Conges/visualisation-conges/visualisation-conges.component";
import {CongesEnAttenteComponent} from "./Conges/conges-en-attente/conges-en-attente.component";
import {MonCompteComponent} from "./Parametres/mon-compte/mon-compte.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdministrationProjetComponent} from "./Cra/administration/projet/administration-projet/administration-projet.component";
import {CalendarMounthComponent} from "./Cra/calendar-mounth/calendar-mounth.component";
import {CompteRenduActiviteComponent} from "./Cra/compte rendu activite/compte-rendu-activite/compte-rendu-activite.component";
import {AdministrationCraComponent} from "./Cra/administration/administration-cra/administration-cra.component";
import {ProjetPdfComponent} from './Cra/administration/projet/update-project/projet-pdf/projet-pdf.component';
import {AuthGuard} from './connexion/auth-guaard.service';
import {AuthGuardConnexion} from './connexion/auth-guard-connexion.service';

const routes: Routes = [
  { path: 'generate-pdf', canActivate : [AuthGuard], component : ProjetPdfComponent},
  { path: 'administration-projet', canActivate : [AuthGuard], component : AdministrationProjetComponent},
  { path: 'calendar', canActivate : [AuthGuardConnexion], component : CalendarMounthComponent},
  { path: 'compte-rendu-activite/:date', canActivate : [AuthGuardConnexion], component : CompteRenduActiviteComponent},
  { path: 'administration-cra', canActivate : [AuthGuard], component : AdministrationCraComponent},
  { path: 'connexion', component: ConnexionComponent },
  { path: 'visualisation', canActivate : [AuthGuard], component: VisualisationComponent },
  { path: 'ajouter', canActivate : [AuthGuardConnexion], component: AjouterComponent },
  { path: 'utilisateurs', canActivate : [AuthGuardConnexion], component: UtilisateursComponent },
  { path: 'visualisation-conges', canActivate : [AuthGuardConnexion], component: VisualisationCongesComponent },
  { path: 'conges-en-attente', canActivate : [AuthGuardConnexion], component: CongesEnAttenteComponent },
  { path: 'mon-compte', canActivate : [AuthGuardConnexion], component: MonCompteComponent },
  { path: 'accueil', canActivate : [AuthGuardConnexion], component: DashboardComponent },
  { path: '',   redirectTo: '/connexion', pathMatch: 'full' },
  { path: '**', redirectTo: '/connexion' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationComponent, AjouterComponent, ConnexionComponent, UtilisateursComponent, VisualisationCongesComponent]
