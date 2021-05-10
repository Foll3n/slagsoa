import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { AjouterComponent } from './ajouter/ajouter.component';

const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'visualisation', component: VisualisationComponent },
  { path: 'ajouter', component: AjouterComponent },
  { path: '',   redirectTo: '/connexion', pathMatch: 'full' },
  { path: '**', redirectTo: '/connexion' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationComponent, AjouterComponent, ConnexionComponent]
