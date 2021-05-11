import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../entete/navbar/navbar.component';
import { BaspageComponent } from '../entete/baspage/baspage.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { AjouterComponent } from './ajouter/ajouter.component';
import { ListeFacturesComponent } from './visualisation/liste-factures/liste-factures.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerComponent } from './visualisation/date-picker/date-picker.component';
import { GraphLigneComponent } from './visualisation/graph-ligne/graph-ligne.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RecherchePipe } from './recherche.pipe';
import { ChartsModule } from 'ng2-charts';
import { RecherchecPipe } from './recherchec.pipe';
import { RecherchescPipe } from './recherchesc.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BaspageComponent,
    routingComponents,
    ListeFacturesComponent,
    DatePickerComponent,
    GraphLigneComponent,
    VisualisationComponent,
    ConnexionComponent,
    RecherchePipe,
    RecherchecPipe,
    RecherchescPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
