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

const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'visualisation', component: VisualisationComponent },
  { path: 'ajouter', component: AjouterComponent },
  { path: 'utilisateurs', component: UtilisateursComponent },
  { path: 'visualisation-conges', component: VisualisationCongesComponent },
  { path: 'conges-en-attente', component: CongesEnAttenteComponent },
  { path: 'mon-compte', component: MonCompteComponent },
  { path: 'accueil', component: DashboardComponent },
  { path: '',   redirectTo: '/connexion', pathMatch: 'full' },
  { path: '**', redirectTo: '/connexion' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationComponent, AjouterComponent, ConnexionComponent, UtilisateursComponent, VisualisationCongesComponent]
